const Joi = require("joi");
const { Tag } = require("../models/Tag");
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
    if (error)
      return res.status(400).json({ message: error.details[0].message });

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
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { name, slug } = value;
    const update = {};
    if (name !== undefined) update.name = name;
    if (slug !== undefined) update.slug = slug;

    const tag = await Tag.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
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

async function generateTag(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = `Generate a creative and unique tag for a blog platform. 
Format it as JSON with 'name' and 'slug' fields. 
The name should be 1-3 words, catchy and relevant to common blog topics (tech, lifestyle, travel, food, etc.).
The slug should be lowercase, hyphenated version of the name.
Example: {"name": "Tech Tips", "slug": "tech-tips"}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const generated = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { name: "AI Generated Tag", slug: "ai-generated-tag" };

    res.json({
      name: generated.name,
      slug: generated.slug,
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      message: "Could not generate tag: " + (err.message || "Unknown error"),
    });
  }
}

module.exports = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  generateTag,
};
