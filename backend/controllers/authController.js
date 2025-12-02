const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { User } = require("../models/User");
const { Profile } = require("../models/Profile");

async function register(req, res) {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username, email, password } = value;

    // Vérifier si l'utilisateur existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Créer le profil associé
    await Profile.create({ user: user._id, bio: "", avatarUrl: "" });

    // Générer le token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Générer le token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

function logout(req, res) {
  // With stateless JWT, logout is handled on the client (token deletion).
  res.json({ message: "Logged out" });
}

module.exports = { register, login, logout };
