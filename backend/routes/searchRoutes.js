const express = require("express");
const { search } = require("../controllers/searchController");

const router = express.Router();

// Public search endpoint
// Query params: q (required), type (optional: all, posts, users, tags, comments)
// Example: /api/search?q=javascript&type=posts
router.get("/", search);

module.exports = router;
