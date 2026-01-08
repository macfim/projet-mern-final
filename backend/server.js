const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const tagRoutes = require("./routes/tagRoutes");
const searchRoutes = require("./routes/searchRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts/:postId/comments", commentRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/search", searchRoutes);

// Start server once DB is connected
// If MONGO_URI is not provided, fall back to the local Docker MongoDB instance
const mongoUri =
  process.env.MONGO_URI ||
  "mongodb://mernfinal_user:mernfinal_password@localhost:27017/simple_mern_blog?authSource=admin";

connectDB(mongoUri).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
