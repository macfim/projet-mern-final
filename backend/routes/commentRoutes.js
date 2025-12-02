const express = require("express");
const {
  getCommentsForPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController");
const { protect } = require("../middleware/authMiddleware");

// mergeParams: true allows this router to access params from parent routes
// In this case, we need access to :postId from /api/posts/:postId/comments
const router = express.Router({ mergeParams: true });

router.get("/", getCommentsForPost);
router.post("/", protect, createComment);
router.put("/:commentId", protect, updateComment);
router.delete("/:commentId", protect, deleteComment);

module.exports = router;
