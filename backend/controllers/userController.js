const Joi = require("joi");
const { User } = require("../models/User");

async function getUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get users" });
  }
}

async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get user" });
  }
}

async function updateUser(req, res) {
  try {
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { username } = value;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username },
      { new: true }
    ).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update user" });
  }
}

async function deleteUser(req, res) {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete user" });
  }
}

module.exports = { getUsers, getUserById, updateUser, deleteUser };
