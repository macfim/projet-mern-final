const Joi = require("joi");
const { Tag } = require("../models/Tag");

async function getTags(req, res) {
  try {
    const tags = await Tag.find().sort({ name: 1 });
    res.json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get tags" });
  }
}

async function getTagById(req, res) {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get tag" });
  }
}

async function createTag(req, res) {
  try {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50).required(),
      slug: Joi.string().min(1).max(50).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, slug } = value;
    const tag = await Tag.create({ name, slug });
    res.status(201).json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create tag" });
  }
}

async function updateTag(req, res) {
  try {
    const schema = Joi.object({
      name: Joi.string().min(1).max(50),
      slug: Joi.string().min(1).max(50),
    });
    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, slug } = value;
    const update = {};
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slug;

    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json(tag);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update tag" });
  }
}

async function deleteTag(req, res) {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Tag not found" });
    }
    res.json({ message: "Tag deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete tag" });
  }
}

module.exports = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
};
