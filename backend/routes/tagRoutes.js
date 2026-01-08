const express = require("express");
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  generateTag,
} = require("../controllers/tagController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getTags); // Public route
router.get("/:id", getTagById); // Public route

// Tag management requires admin access
router.post("/", protect, isAdmin, createTag);
router.post("/generate", protect, isAdmin, generateTag);
router.put("/:id", protect, isAdmin, updateTag);
router.delete("/:id", protect, isAdmin, deleteTag);

module.exports = router;
