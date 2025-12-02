const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.userId = decoded.userId;
      req.userRole = decoded.role;

      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token invalide" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Pas de token, accès refusé" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    // Check if user is authenticated first
    if (!req.userId) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    // Check role from token first (faster)
    if (req.userRole === "admin") {
      return next();
    }

    // Fallback: check database (in case token is old)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Accès refusé. Droits administrateur requis.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { protect, isAdmin };
