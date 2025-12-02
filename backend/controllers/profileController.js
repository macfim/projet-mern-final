const Joi = require("joi");
const { Profile } = require("../models/Profile");

async function getMyProfile(req, res) {
  try {
    const profile = await Profile.findOne({ user: req.userId }).populate(
      "user",
      "username email"
    );
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get profile" });
  }
}

async function updateMyProfile(req, res) {
  try {
    const schema = Joi.object({
      bio: Joi.string().allow("").max(500),
      avatarUrl: Joi.string().uri().allow(""),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { bio, avatarUrl } = value;
    const update = {};
    if (bio !== undefined) update.bio = bio;
    if (avatarUrl !== undefined) update.avatarUrl = avatarUrl;

    const profile = await Profile.findOneAndUpdate(
      { user: req.userId },
      update,
      { new: true }
    ).populate("user", "username email");
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update profile" });
  }
}

module.exports = { getMyProfile, updateMyProfile };
