const Joi = require("joi");
const { Post } = require("../models/Post");
const { Tag } = require("../models/Tag");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getPosts(req, res) {
  try {
    const filter = {};
    if (req.query.author) {
      filter.author = req.query.author;
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    const posts = await Post.find(filter)
      .populate("author", "username")
      .populate("tags", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get posts" });
  }
}

async function getMyPosts(req, res) {
  try {
    const posts = await Post.find({ author: req.userId })
      .populate("author", "username")
      .populate("tags", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get your posts" });
  }
}

async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("tags", "name");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get post" });
  }
}

async function createPost(req, res) {
  try {
    const schema = Joi.object({
      title: Joi.string().min(1).max(200).required(),
      content: Joi.string().min(1).required(),
      tagIds: Joi.array().items(Joi.string()).default([]),
    });
    const { error, value } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { title, content, tagIds } = value;
    const tags = Array.isArray(tagIds) ? tagIds : [];
    const post = await Post.create({
      title,
      content,
      author: req.userId,
      tags,
    });
    await post.populate("author", "username");
    await post.populate("tags", "name");
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create post" });
  }
}

async function updatePost(req, res) {
  try {
    const schema = Joi.object({
      title: Joi.string().min(1).max(200),
      content: Joi.string().min(1),
      tagIds: Joi.array().items(Joi.string()),
    });
    const { error, value } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { title, content, tagIds } = value;
    const tags = Array.isArray(tagIds) ? tagIds : undefined;

    const update = {};
    if (title !== undefined) update.title = title;
    if (content !== undefined) update.content = content;
    if (tags !== undefined) update.tags = tags;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, author: req.userId },
      update,
      { new: true }
    )
      .populate("author", "username")
      .populate("tags", "name");

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or not owned by user" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update post" });
  }
}

async function deletePost(req, res) {
  try {
    const deleted = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.userId,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Post not found or not owned by user" });
    }
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete post" });
  }
}

async function generatePost(req, res) {
  try {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) {
      return res.status(500).json({ message: "GEMINI_API_KEY not configured" });
    }

    // Get available tags
    const tags = await Tag.find().sort({ name: 1 });
    const tagNames = tags.map((t) => t.name).join(", ");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });
    const prompt = `Generate a short blog post with a title and content about a random interesting topic. 
Available tags: ${tagNames || "none"}
Format it as JSON with 'title', 'content', and 'tagNames' fields (tagNames should be an array of 1-3 relevant tag names from the available tags list, or empty array if none match). Keep it under 200 words.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const generated = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : { title: "AI Generated Post", content: text, tagNames: [] };

    // Match tag names to tag IDs
    const tagIds = [];
    if (generated.tagNames && Array.isArray(generated.tagNames)) {
      generated.tagNames.forEach((tagName) => {
        const tag = tags.find(
          (t) => t.name.toLowerCase() === tagName.toLowerCase()
        );
        if (tag) tagIds.push(tag._id.toString());
      });
    }

    res.json({
      title: generated.title,
      content: generated.content,
      tagIds: tagIds,
    });
  } catch (err) {
    console.error("Gemini API Error:", err);
    res.status(500).json({
      message: "Could not generate post: " + (err.message || "Unknown error"),
    });
  }
}

module.exports = {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  generatePost,
};
