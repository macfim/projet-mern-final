const express = require("express");
const {
  getPosts,
  getMyPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  generatePost,
} = require("../controllers/postController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getPosts); // Public route
router.get("/me", protect, getMyPosts); // Must be before /:id
router.get("/:id", getPostById); // Public route

router.post("/", protect, createPost);
router.post("/generate", protect, generatePost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
