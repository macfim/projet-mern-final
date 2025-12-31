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

// Helper function to generate random date within last 2 years
function getRandomDate() {
  const now = new Date();
  const twoYearsAgo = new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
  const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
  return new Date(randomTime);
}

// Helper function to get random items from array
function getRandomItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
}

async function seedDatabase() {
  console.log("Seeding database...\n");

  // Create Users (50 users)
  const hashedPassword = await bcrypt.hash("password123", 10);
  
  const userData = [
    { username: "admin", email: "admin@example.com", role: "admin" },
    { username: "john_doe", email: "john@example.com", role: "user" },
    { username: "jane_smith", email: "jane@example.com", role: "user" },
    { username: "bob_wilson", email: "bob@example.com", role: "user" },
  ];
  
  // Generate additional users
  const firstNames = ["alice", "charlie", "diana", "edward", "fiona", "george", "helen", "ivan", "julia", "kevin", "laura", "michael", "nina", "oscar", "patricia", "quinn", "rachel", "steven", "tina", "ulrich", "victoria", "william", "xara", "yuki", "zoe", "alex", "brian", "carla", "david", "emma", "frank", "grace", "henry", "isabel", "jack", "kate", "liam", "mia", "noah", "olivia", "peter", "quinn", "ruby", "sam", "tara"];
  const lastNames = ["anderson", "brown", "clark", "davis", "evans", "foster", "garcia", "harris", "jackson", "kelly", "lee", "martin", "nelson", "owen", "parker", "quinn", "rivera", "smith", "taylor", "underwood", "vargas", "white", "young", "zimmerman"];
  
  for (let i = 0; i < 46; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName}_${lastName}_${i}`;
    const email = `${username}@example.com`;
    userData.push({ username, email, role: "user" });
  }
  
  const users = await User.insertMany(
    userData.map(user => ({
      ...user,
      password: hashedPassword,
    }))
  );
  console.log(`✓ Created ${users.length} users`);

  // Create Profiles for all users
  const profiles = await Profile.insertMany(
    users.map((user, index) => ({
      user: user._id,
      bio: `Bio for ${user.username}. ${index % 3 === 0 ? "Passionate developer" : index % 3 === 1 ? "Tech enthusiast" : "Content creator"}.`,
      avatarUrl: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
    }))
  );
  console.log(`✓ Created ${profiles.length} profiles`);

  // Create Tags (25 tags)
  const tags = await Tag.insertMany([
    { name: "JavaScript", slug: "javascript" },
    { name: "React", slug: "react" },
    { name: "Node.js", slug: "nodejs" },
    { name: "MongoDB", slug: "mongodb" },
    { name: "Web Development", slug: "web-development" },
    { name: "Tutorial", slug: "tutorial" },
    { name: "Tips & Tricks", slug: "tips-tricks" },
    { name: "TypeScript", slug: "typescript" },
    { name: "Vue.js", slug: "vuejs" },
    { name: "Angular", slug: "angular" },
    { name: "Python", slug: "python" },
    { name: "Docker", slug: "docker" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "AWS", slug: "aws" },
    { name: "DevOps", slug: "devops" },
    { name: "GraphQL", slug: "graphql" },
    { name: "REST API", slug: "rest-api" },
    { name: "Database", slug: "database" },
    { name: "Security", slug: "security" },
    { name: "Performance", slug: "performance" },
    { name: "Testing", slug: "testing" },
    { name: "CI/CD", slug: "ci-cd" },
    { name: "Frontend", slug: "frontend" },
    { name: "Backend", slug: "backend" },
    { name: "Full Stack", slug: "full-stack" },
  ]);
  console.log(`✓ Created ${tags.length} tags`);

  // Create Posts (400 posts)
  const postTitles = [
    "Getting Started with React Hooks",
    "Building RESTful APIs with Node.js and Express",
    "MongoDB Best Practices for Beginners",
    "10 JavaScript Tips Every Developer Should Know",
    "Understanding the MERN Stack",
    "Advanced TypeScript Patterns",
    "Docker Containerization Guide",
    "Kubernetes Deployment Strategies",
    "AWS Cloud Architecture",
    "GraphQL vs REST API",
    "Database Optimization Techniques",
    "Web Security Best Practices",
    "Performance Optimization Tips",
    "Testing Strategies for React",
    "CI/CD Pipeline Setup",
    "Frontend Architecture Patterns",
    "Backend Design Principles",
    "Full Stack Development Guide",
    "Modern JavaScript Features",
    "React Performance Optimization",
    "Node.js Async Patterns",
    "MongoDB Aggregation Pipeline",
    "TypeScript Advanced Types",
    "Vue.js Component Design",
    "Angular Dependency Injection",
    "Python Web Frameworks",
    "Docker Compose Tutorial",
    "Kubernetes Service Mesh",
    "AWS Lambda Functions",
    "DevOps Automation Tools",
    "GraphQL Schema Design",
    "REST API Versioning",
    "Database Indexing Strategies",
    "Authentication and Authorization",
    "Code Review Best Practices",
    "Agile Development Workflow",
    "Microservices Architecture",
    "Serverless Computing",
    "Cloud Native Applications",
    "API Gateway Patterns",
  ];
  
  const postContents = [
    "This comprehensive guide covers all the essential concepts and provides practical examples to help you master the topic. We'll explore various approaches and best practices that industry professionals use every day.",
    "In this detailed tutorial, we'll walk through step-by-step instructions to build a complete solution. You'll learn about common pitfalls and how to avoid them, along with real-world examples.",
    "Understanding these concepts is crucial for modern development. This post breaks down complex topics into digestible pieces, making it easy for developers of all levels to follow along.",
    "We'll dive deep into the technical details while keeping the explanations clear and accessible. By the end of this guide, you'll have a solid understanding of the subject matter.",
    "This article presents a thorough analysis of the topic, covering both theoretical foundations and practical applications. Real-world case studies are included to illustrate key points.",
    "Learn from industry experts who share their insights and experiences. This comprehensive resource includes code examples, diagrams, and detailed explanations.",
    "We'll explore advanced techniques and patterns that can significantly improve your development workflow. Each concept is explained with practical examples you can use immediately.",
    "This guide provides a complete overview of the technology, from basic concepts to advanced implementations. You'll find tips and tricks that can save you hours of development time.",
    "Understanding the fundamentals is key to mastering any technology. This post covers everything you need to know, from installation to deployment.",
    "We'll examine different approaches and compare their pros and cons. This will help you make informed decisions for your projects.",
  ];
  
  const posts = [];
  for (let i = 0; i < 400; i++) {
    const randomDate = getRandomDate();
    const title = postTitles[i % postTitles.length] + (i >= postTitles.length ? ` - Part ${Math.floor(i / postTitles.length) + 1}` : "");
    const content = postContents[i % postContents.length] + ` This is post number ${i + 1} with additional content to make it more substantial. ` + 
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. " +
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. " +
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. " +
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. " +
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium. " +
      "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.";
    
    const author = users[Math.floor(Math.random() * users.length)];
    const numTags = Math.floor(Math.random() * 4) + 1; // 1-4 tags
    const postTags = getRandomItems(tags, numTags).map(t => t._id);
    
    posts.push({
      title,
      content,
      author: author._id,
      tags: postTags,
      createdAt: randomDate,
      updatedAt: randomDate,
    });
  }
  
  const insertedPosts = await Post.insertMany(posts);
  console.log(`✓ Created ${insertedPosts.length} posts`);

  // Create Comments (1500 comments)
  const commentTemplates = [
    "Great post! This really helped me understand the concept better.",
    "Thanks for sharing! I've been looking for a resource like this.",
    "Excellent explanation. The examples were particularly helpful.",
    "I have a question about the implementation. Could you clarify?",
    "This is exactly what I needed. Bookmarking for future reference!",
    "Very informative. I'll definitely try this approach in my next project.",
    "I've been struggling with this for a while. Your solution works perfectly!",
    "Nice work! The step-by-step guide made it easy to follow.",
    "I disagree with point #3, but overall a solid article.",
    "Could you provide more details on the advanced use cases?",
    "This saved me hours of research. Much appreciated!",
    "I followed along and it worked perfectly. Thanks!",
    "Interesting perspective. I hadn't considered this approach before.",
    "The code examples are clear and well-documented. Great job!",
    "I'm new to this topic, and this post was a great starting point.",
    "This is a common problem, and your solution is elegant.",
    "I've implemented something similar, but your approach is better.",
    "Would love to see a follow-up post on related topics.",
    "The performance tips were especially useful. Thanks!",
    "I encountered an issue with step 5. Any suggestions?",
  ];
  
  const comments = [];
  for (let i = 0; i < 1500; i++) {
    const post = insertedPosts[Math.floor(Math.random() * insertedPosts.length)];
    const author = users[Math.floor(Math.random() * users.length)];
    const content = commentTemplates[i % commentTemplates.length] + (i >= commentTemplates.length ? ` (Comment ${i + 1})` : "");
    const randomDate = getRandomDate();
    
    // Ensure comment date is after post date
    const commentDate = new Date(Math.max(randomDate.getTime(), post.createdAt.getTime()));
    
    comments.push({
      post: post._id,
      author: author._id,
      content,
      createdAt: commentDate,
      updatedAt: commentDate,
    });
  }
  
  await Comment.insertMany(comments);
  console.log(`✓ Created ${comments.length} comments`);

  console.log("\n✅ Database seeded successfully!");
  console.log("\nSample login credentials:");
  console.log("  Admin: admin@example.com / password123");
  console.log("  User:  john@example.com / password123");
  console.log("  User:  jane@example.com / password123");
  console.log("  User:  bob@example.com / password123");
  console.log(`\nTotal data created:`);
  console.log(`  - ${users.length} users`);
  console.log(`  - ${profiles.length} profiles`);
  console.log(`  - ${tags.length} tags`);
  console.log(`  - ${insertedPosts.length} posts`);
  console.log(`  - ${comments.length} comments`);
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

