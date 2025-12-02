const Joi = require("joi");
const { Comment } = require("../models/Comment");
const { Post } = require("../models/Post");

async function getCommentsForPost(req, res) {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not get comments" });
  }
}

async function createComment(req, res) {
  try {
    const schema = Joi.object({
      content: Joi.string().min(1).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { content } = value;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = await Comment.create({
      post: req.params.postId,
      author: req.userId,
      content,
    });
    const populated = await comment.populate("author", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not create comment" });
  }
}

async function updateComment(req, res) {
  try {
    const schema = Joi.object({
      content: Joi.string().min(1).required(),
    });
    const { error, value } = schema.validate(req.body);
    if (error)
      return res.status(400).json({ message: error.details[0].message });

    const { content } = value;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, author: req.userId },
      { content },
      { new: true }
    ).populate("author", "name");
    if (!comment) {
      return res
        .status(404)
        .json({ message: "Comment not found or not owned by user" });
    }
    res.json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update comment" });
  }
}

async function deleteComment(req, res) {
  try {
    const deleted = await Comment.findOneAndDelete({
      _id: req.params.commentId,
      author: req.userId,
    });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Comment not found or not owned by user" });
    }
    res.json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete comment" });
  }
}

module.exports = {
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
};
