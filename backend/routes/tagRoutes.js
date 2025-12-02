const express = require("express");
const {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tagController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getTags); // Public route
router.get("/:id", getTagById); // Public route

// Tag management requires admin access
router.post("/", protect, isAdmin, createTag);
router.put("/:id", protect, isAdmin, updateTag);
router.delete("/:id", protect, isAdmin, deleteTag);

module.exports = router;
