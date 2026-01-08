const { Post } = require("../models/Post");
const { User } = require("../models/User");
const { Tag } = require("../models/Tag");
const { Comment } = require("../models/Comment");

async function search(req, res) {
  try {
    const { q, type } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const query = q.trim();
    const searchType = type || "all"; // all, posts, users, tags, comments

    const results = {
      query,
      posts: [],
      users: [],
      tags: [],
      comments: [],
    };

    // Search posts by title or content
    if (searchType === "all" || searchType === "posts") {
      results.posts = await Post.find({
        $or: [
          { title: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
        ],
      })
        .populate("author", "username")
        .populate("tags", "name")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Search users by username or email (admin only for email)
    if (searchType === "all" || searchType === "users") {
      results.users = await User.find({
        $or: [
          { username: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
        ],
      })
        .select("-password")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Search tags by name or slug
    if (searchType === "all" || searchType === "tags") {
      results.tags = await Tag.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { slug: { $regex: query, $options: "i" } },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Search comments by content
    if (searchType === "all" || searchType === "comments") {
      results.comments = await Comment.find({
        content: { $regex: query, $options: "i" },
      })
        .populate("author", "username")
        .populate("post", "title")
        .sort({ createdAt: -1 })
        .limit(20);
    }

    // Calculate total results
    results.total =
      results.posts.length +
      results.users.length +
      results.tags.length +
      results.comments.length;

    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
}

module.exports = { search };
