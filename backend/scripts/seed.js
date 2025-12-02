const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { connectDB } = require("../config/db");
const { User } = require("../models/User");
const { Profile } = require("../models/Profile");
const { Post } = require("../models/Post");
const { Comment } = require("../models/Comment");
const { Tag } = require("../models/Tag");

dotenv.config();

async function deleteAllData() {
  console.log("Deleting all data...");
  
  // Delete in order to respect foreign key constraints
  await Comment.deleteMany({});
  console.log("✓ Deleted all comments");
  
  await Post.deleteMany({});
  console.log("✓ Deleted all posts");
  
  await Tag.deleteMany({});
  console.log("✓ Deleted all tags");
  
  await Profile.deleteMany({});
  console.log("✓ Deleted all profiles");
  
  await User.deleteMany({});
  console.log("✓ Deleted all users");
  
  console.log("All data deleted successfully!\n");
}

async function seedDatabase() {
  console.log("Seeding database...\n");

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const users = await User.insertMany([
    {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
    {
      username: "john_doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "user",
    },
    {
      username: "jane_smith",
      email: "jane@example.com",
      password: hashedPassword,
      role: "user",
    },
    {
      username: "bob_wilson",
      email: "bob@example.com",
      password: hashedPassword,
      role: "user",
    },
  ]);
  console.log(`✓ Created ${users.length} users`);

  // Create Profiles
  const profiles = await Profile.insertMany([
    {
      user: users[0]._id,
      bio: "I'm the admin of this blog. I love technology and coding!",
      avatarUrl: "https://i.pravatar.cc/150?img=1",
    },
    {
      user: users[1]._id,
      bio: "Software developer passionate about web development and open source.",
      avatarUrl: "https://i.pravatar.cc/150?img=2",
    },
    {
      user: users[2]._id,
      bio: "Content creator and tech enthusiast. Always learning something new!",
      avatarUrl: "https://i.pravatar.cc/150?img=3",
    },
    {
      user: users[3]._id,
      bio: "Full-stack developer with a love for clean code and good coffee.",
      avatarUrl: "https://i.pravatar.cc/150?img=4",
    },
  ]);
  console.log(`✓ Created ${profiles.length} profiles`);

  // Create Tags
  const tags = await Tag.insertMany([
    { name: "JavaScript", slug: "javascript" },
    { name: "React", slug: "react" },
    { name: "Node.js", slug: "nodejs" },
    { name: "MongoDB", slug: "mongodb" },
    { name: "Web Development", slug: "web-development" },
    { name: "Tutorial", slug: "tutorial" },
    { name: "Tips & Tricks", slug: "tips-tricks" },
  ]);
  console.log(`✓ Created ${tags.length} tags`);

  // Create Posts
  const posts = await Post.insertMany([
    {
      title: "Getting Started with React Hooks",
      content: "React Hooks revolutionized the way we write React components. In this post, we'll explore useState, useEffect, and other essential hooks that every React developer should know. Hooks allow us to use state and other React features in functional components, making our code more reusable and easier to understand.",
      author: users[1]._id,
      tags: [tags[0]._id, tags[1]._id, tags[4]._id],
    },
    {
      title: "Building RESTful APIs with Node.js and Express",
      content: "Learn how to create robust RESTful APIs using Node.js and Express. We'll cover routing, middleware, error handling, and best practices for building scalable backend services. This tutorial will walk you through creating a complete API from scratch.",
      author: users[0]._id,
      tags: [tags[2]._id, tags[4]._id, tags[5]._id],
    },
    {
      title: "MongoDB Best Practices for Beginners",
      content: "MongoDB is a powerful NoSQL database that's perfect for modern web applications. In this guide, we'll discuss schema design, indexing strategies, and common pitfalls to avoid. Whether you're new to MongoDB or looking to improve your skills, this post has something for you.",
      author: users[2]._id,
      tags: [tags[3]._id, tags[5]._id],
    },
    {
      title: "10 JavaScript Tips Every Developer Should Know",
      content: "JavaScript is full of hidden gems and useful patterns. Here are 10 tips that will make you a better JavaScript developer. From destructuring to async/await, these techniques will help you write cleaner and more efficient code.",
      author: users[1]._id,
      tags: [tags[0]._id, tags[6]._id],
    },
    {
      title: "Understanding the MERN Stack",
      content: "The MERN stack (MongoDB, Express, React, Node.js) is one of the most popular full-stack JavaScript solutions. This comprehensive guide will help you understand how all the pieces fit together and how to build a complete web application using these technologies.",
      author: users[3]._id,
      tags: [tags[1]._id, tags[2]._id, tags[3]._id, tags[4]._id],
    },
  ]);
  console.log(`✓ Created ${posts.length} posts`);

  // Create Comments
  await Comment.insertMany([
    {
      post: posts[0]._id,
      author: users[2]._id,
      content: "Great introduction to React Hooks! This really helped me understand the basics.",
    },
    {
      post: posts[0]._id,
      author: users[3]._id,
      content: "Thanks for sharing! I've been meaning to learn hooks for a while now.",
    },
    {
      post: posts[1]._id,
      author: users[1]._id,
      content: "Excellent tutorial! The error handling section was particularly helpful.",
    },
    {
      post: posts[1]._id,
      author: users[2]._id,
      content: "I followed along and built my first API. Thanks for the clear explanations!",
    },
    {
      post: posts[2]._id,
      author: users[0]._id,
      content: "These best practices are spot on. Every MongoDB developer should read this.",
    },
    {
      post: posts[3]._id,
      author: users[2]._id,
      content: "Some really useful tips here! I didn't know about some of these patterns.",
    },
    {
      post: posts[4]._id,
      author: users[1]._id,
      content: "Perfect overview of the MERN stack. This is exactly what I needed!",
    },
  ]);
  console.log(`✓ Created 7 comments`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\nSample login credentials:");
  console.log("  Admin: admin@example.com / password123");
  console.log("  User:  john@example.com / password123");
  console.log("  User:  jane@example.com / password123");
  console.log("  User:  bob@example.com / password123");
}

async function runSeed() {
  try {
    // Connect to database
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://mernfinal_user:mernfinal_password@localhost:27017/simple_mern_blog?authSource=admin";
    
    await connectDB(mongoUri);
    console.log("Connected to MongoDB\n");

    // Delete all existing data
    await deleteAllData();

    // Seed the database
    await seedDatabase();

    // Close connection
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed script
runSeed();

