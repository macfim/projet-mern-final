//
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

/**
 * Enhanced seed script with high variation for analytics:
 * - Dramatic differences between 2025 (early stage) and 2026 (growth phase)
 * - Distinct monthly patterns showing seasonal variations
 * - Clear growth trajectory showing app gaining popularity
 * - Varied user engagement patterns over time
 * - Rich data for time-series analysis
 */

// Targets (tune)
const TARGET_USERS = 500;
const TARGET_POSTS = 5000;
const TARGET_COMMENTS = 15000;

// Date range
const RANGE_START = new Date("2025-01-01T00:00:00.000Z");
const RANGE_END = new Date("2026-12-31T23:59:59.999Z");

// Enhanced monthly variation - each month has distinct characteristics
// Simulates real-world patterns: slow start, summer peak, holiday dip, etc.
const monthlyVariation = {
  0: 0.75, // January - slow start, new year
  1: 0.8, // February - slight increase
  2: 0.9, // March - picking up
  3: 1.1, // April - spring growth
  4: 1.25, // May - strong growth
  5: 1.4, // June - summer peak
  6: 1.5, // July - peak activity
  7: 1.35, // August - high but declining
  8: 1.2, // September - back to school boost
  9: 1.15, // October - steady
  10: 1.05, // November - slight dip
  11: 0.95, // December - holiday slowdown
};

// Dramatic year variation - 2026 should be 2.5-3x more active than 2025
// Shows clear app growth and popularity increase
const yearVariation = {
  2025: 0.4, // Early stage - low activity
  2026: 1.6, // Growth phase - much higher activity
};

// -------- utilities --------
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function buildMonths(start, end) {
  const months = [];
  const cursor = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1, 0, 0, 0)
  );
  const endMarker = new Date(
    Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1, 0, 0, 0)
  );

  while (cursor.getTime() <= endMarker.getTime()) {
    const y = cursor.getUTCFullYear();
    const m = cursor.getUTCMonth();
    const monthStart = new Date(Date.UTC(y, m, 1, 0, 0, 0));
    const monthEnd = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59));
    months.push({ year: y, month: m, start: monthStart, end: monthEnd });
    cursor.setUTCMonth(cursor.getUTCMonth() + 1);
  }
  return months;
}

function randomDateInMonth(year, month) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const day = randInt(1, daysInMonth);
  const hour = randInt(0, 23);
  const minute = randInt(0, 59);
  const second = randInt(0, 59);
  return new Date(Date.UTC(year, month, day, hour, minute, second));
}

function allocateByWeights(total, weights) {
  const sum = weights.reduce((s, w) => s + w, 0);
  if (sum <= 0) return weights.map(() => 0);

  const raw = weights.map((w) => (total * w) / sum);
  const base = raw.map((x) => Math.floor(x));
  let remainder = total - base.reduce((s, x) => s + x, 0);

  const frac = raw
    .map((x, i) => ({ i, f: x - base[i] }))
    .sort((a, b) => b.f - a.f);

  for (let k = 0; k < remainder; k++) base[frac[k % frac.length].i] += 1;
  return base;
}

function binarySearchLastLE(arr, date, getTime) {
  let lo = 0,
    hi = arr.length - 1,
    ans = -1;
  const t = date.getTime();
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (getTime(arr[mid]) <= t) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
}

function pickRecentIndex(maxExclusive, recencyBias = 0.55) {
  // returns 0..maxExclusive-1 biased toward recent end
  const r = 1 - Math.pow(Math.random(), recencyBias);
  return Math.floor(r * maxExclusive);
}

function getRandomItems(array, count) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(count, copy.length));
}

async function deleteAllData() {
  console.log("Deleting all data...");

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

// -------- seeding --------
async function seedDatabase() {
  console.log("Seeding database...\n");

  const months = buildMonths(RANGE_START, RANGE_END);

  // Enhanced growth curve with exponential growth showing popularity increase
  // Early months (2025) have very low activity, later months (2026) have high activity
  const monthWeights = months.map((m, idx) => {
    const progress = months.length === 1 ? 1 : idx / (months.length - 1);

    // Exponential growth curve: starts very low, grows dramatically
    // This creates a clear "app gaining popularity" trend
    const growth = 0.3 + 2.7 * Math.pow(progress, 2.2);

    // Monthly seasonal variation
    const season = monthlyVariation[m.month] ?? 1.0;

    // Year multiplier (2025 vs 2026 difference)
    const yVar = yearVariation[m.year] ?? 1.0;

    // Add some random variation per month for more realistic data
    const randomVariation = 0.85 + Math.random() * 0.3; // 0.85 to 1.15

    return growth * season * yVar * randomVariation;
  });

  const usersPerMonth = allocateByWeights(TARGET_USERS, monthWeights);
  const postsPerMonth = allocateByWeights(TARGET_POSTS, monthWeights);
  const commentsPerMonth = allocateByWeights(TARGET_COMMENTS, monthWeights);

  // Role share curves over time with more variation
  // Early stage: admins are very active (bootstrapping content)
  // Growth stage: users dominate (community-driven)
  function adminPostShare(progress01) {
    // More dramatic shift: 25% early -> 5% later
    return clamp(lerp(0.25, 0.05, progress01), 0.03, 0.3);
  }
  function adminCommentShare(progress01) {
    // Admins comment more early, less later
    return clamp(lerp(0.3, 0.06, progress01), 0.04, 0.4);
  }

  // Engagement intensity varies by time period
  function getEngagementMultiplier(progress01, year) {
    // Early 2025: low engagement (few users)
    // Late 2025: medium engagement (growing)
    // 2026: high engagement (popular app)
    if (year === 2025) {
      return 0.4 + progress01 * 0.3; // 0.4 to 0.7 in 2025
    } else {
      return 0.8 + (progress01 - 0.5) * 0.4; // 0.8 to 1.2 in 2026
    }
  }

  // ---- Users ----
  const hashedPassword = await bcrypt.hash("password123", 10);

  // fixed logins
  const fixedUsers = [
    {
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      createdAt: new Date(Date.UTC(2025, 0, 1, 10, 0, 0)),
    },
    {
      username: "john_doe",
      email: "john@example.com",
      role: "user",
      createdAt: new Date(Date.UTC(2025, 0, 5, 12, 0, 0)),
    },
    {
      username: "jane_smith",
      email: "jane@example.com",
      role: "user",
      createdAt: new Date(Date.UTC(2025, 0, 8, 14, 0, 0)),
    },
    {
      username: "bob_wilson",
      email: "bob@example.com",
      role: "user",
      createdAt: new Date(Date.UTC(2025, 0, 12, 16, 0, 0)),
    },
  ];

  const firstNames = [
    "alice",
    "charlie",
    "diana",
    "edward",
    "fiona",
    "george",
    "helen",
    "ivan",
    "julia",
    "kevin",
    "laura",
    "michael",
    "nina",
    "oscar",
    "patricia",
    "rachel",
    "steven",
    "tina",
    "victoria",
    "william",
    "yuki",
    "zoe",
    "alex",
    "brian",
    "carla",
    "david",
    "emma",
    "frank",
    "grace",
    "henry",
    "isabel",
    "jack",
    "kate",
    "liam",
    "mia",
    "noah",
    "olivia",
    "peter",
    "ruby",
    "sam",
    "tara",
    "ben",
    "chloe",
    "daniel",
    "ella",
    "felix",
    "gina",
    "hugo",
    "iris",
    "james",
    "kelly",
    "lucas",
    "maya",
    "nathan",
    "oliver",
    "paula",
    "ryan",
    "sophia",
    "thomas",
    "una",
    "violet",
    "wade",
    "xander",
    "yara",
    "zach",
  ];
  const lastNames = [
    "anderson",
    "brown",
    "clark",
    "davis",
    "evans",
    "foster",
    "garcia",
    "harris",
    "jackson",
    "kelly",
    "lee",
    "martin",
    "nelson",
    "owen",
    "parker",
    "rivera",
    "smith",
    "taylor",
    "underwood",
    "vargas",
    "white",
    "young",
    "zimmerman",
    "adams",
    "baker",
    "carter",
    "diaz",
    "edwards",
    "flores",
    "green",
    "hill",
    "jones",
    "king",
    "lopez",
    "miller",
    "moore",
    "nguyen",
    "perez",
    "roberts",
    "scott",
    "thomas",
    "turner",
    "walker",
    "wright",
  ];

  const userData = [...fixedUsers];
  let remainingUsers = TARGET_USERS - fixedUsers.length;

  // Ensure we have a “real” admin pool, not only 1 admin.
  // This prevents the admin slice being too tiny in donut/area.
  const ADMIN_POOL_TARGET = 25;
  let adminsCreated = fixedUsers.filter((u) => u.role === "admin").length;

  for (let mi = 0; mi < months.length && remainingUsers > 0; mi++) {
    const m = months[mi];
    const progress = months.length === 1 ? 1 : mi / (months.length - 1);

    const toCreate = clamp(usersPerMonth[mi], 0, remainingUsers);
    remainingUsers -= toCreate;

    // Force some admins early/mid so admins exist across time
    const desiredAdminThisMonth =
      adminsCreated < ADMIN_POOL_TARGET
        ? clamp(Math.round((1 - progress) * 2), 0, 2) // 2/month early -> 0/month later
        : 0;

    for (let k = 0; k < toCreate; k++) {
      const fn = firstNames[Math.floor(Math.random() * firstNames.length)];
      const ln = lastNames[Math.floor(Math.random() * lastNames.length)];
      const suffix = `${mi}_${k}_${Math.floor(Math.random() * 100000)}`;
      const username = `${fn}_${ln}_${suffix}`;
      const email = `${username}@example.com`;
      const createdAt = randomDateInMonth(m.year, m.month);

      let role = "user";
      if (k < desiredAdminThisMonth && adminsCreated < ADMIN_POOL_TARGET) {
        role = "admin";
        adminsCreated++;
      }

      userData.push({ username, email, role, createdAt });
    }
  }

  userData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const users = await User.insertMany(
    userData.map((u) => ({
      username: u.username,
      email: u.email,
      role: u.role,
      password: hashedPassword,
      createdAt: u.createdAt,
      updatedAt: u.createdAt,
    }))
  );
  console.log(
    `✓ Created ${users.length} users (admins: ${
      users.filter((u) => u.role === "admin").length
    })`
  );

  // Bio generation varies by registration time (shows user base evolution)
  const bioTemplates = {
    early: [
      "Early adopter exploring new platforms.",
      "Tech enthusiast looking for quality content.",
      "Developer interested in learning.",
    ],
    mid: [
      "Passionate developer sharing knowledge.",
      "Tech enthusiast and content creator.",
      "Full-stack developer building cool projects.",
      "Software engineer passionate about web development.",
    ],
    late: [
      "Senior developer sharing advanced techniques and best practices.",
      "Tech lead passionate about architecture and system design.",
      "Full-stack engineer | Open source contributor | Tech blogger.",
      "Software architect with 10+ years experience. Love sharing knowledge.",
      "DevOps engineer | Cloud enthusiast | Community builder.",
      "Frontend specialist | React expert | Conference speaker.",
    ],
  };

  const profiles = await Profile.insertMany(
    users.map((user, index) => {
      const userYear = new Date(user.createdAt).getFullYear();
      const userMonth = new Date(user.createdAt).getMonth();
      const isEarly = userYear === 2025 && userMonth < 6;
      const isLate = userYear === 2026;

      let bio;
      if (isEarly) {
        bio = bioTemplates.early[index % bioTemplates.early.length];
      } else if (isLate) {
        bio = bioTemplates.late[index % bioTemplates.late.length];
      } else {
        bio = bioTemplates.mid[index % bioTemplates.mid.length];
      }

      return {
        user: user._id,
        bio: `${bio} ${user.username} here.`,
        avatarUrl: `https://i.pravatar.cc/150?img=${(index % 70) + 1}`,
        createdAt: user.createdAt || new Date(),
        updatedAt: user.createdAt || new Date(),
      };
    })
  );
  console.log(`✓ Created ${profiles.length} profiles`);

  // Pre-split users by role + sort by createdAt (fast “who existed by date?” picking)
  const usersByRole = { admin: [], user: [] };
  for (const u of users) usersByRole[u.role].push(u);
  usersByRole.admin.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  usersByRole.user.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  function pickUserOfRoleAvailableByDate(role, date) {
    const pool = usersByRole[role];
    if (!pool || pool.length === 0) return null;
    const idx = binarySearchLastLE(pool, date, (x) =>
      new Date(x.createdAt).getTime()
    );
    if (idx < 0) return null;
    return pool[Math.floor(Math.random() * (idx + 1))];
  }

  function pickAnyUserAvailableByDate(date) {
    const idx = binarySearchLastLE(users, date, (x) =>
      new Date(x.createdAt).getTime()
    );
    return users[Math.max(0, idx)];
  }

  // ---- Tags ----
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

  // ---- Posts (split per month per role so donut is meaningful) ----
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
  ];

  const insertedPosts = [];
  const postBatchSize = 500;
  let globalPostIndex = 0;

  for (let mi = 0; mi < months.length; mi++) {
    const m = months[mi];
    const progress = months.length === 1 ? 1 : mi / (months.length - 1);
    const total = postsPerMonth[mi];

    const adminCount =
      total > 0
        ? clamp(Math.round(total * adminPostShare(progress)), 1, total)
        : 0;
    const userCount = total - adminCount;

    const makePostsForRole = async (role, count) => {
      let made = 0;
      while (made < count) {
        const batch = [];
        const toMake = Math.min(postBatchSize, count - made);

        for (let i = 0; i < toMake; i++) {
          const createdAt = randomDateInMonth(m.year, m.month);

          const title =
            postTitles[globalPostIndex % postTitles.length] +
            (globalPostIndex >= postTitles.length
              ? ` - ${globalPostIndex + 1}`
              : "");
          globalPostIndex++;

          // Content length and quality varies by time period
          // Early 2025: shorter, simpler posts
          // Late 2025: medium length
          // 2026: longer, more detailed posts (app is popular, users invest more)
          let content = "";
          const year = m.year;
          const monthProgress = mi / months.length;

          if (year === 2025 && monthProgress < 0.3) {
            // Very early: short posts
            content =
              "Quick tip: " +
              postTitles[globalPostIndex % postTitles.length].toLowerCase() +
              ". This is a brief guide for beginners. " +
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
          } else if (year === 2025) {
            // Mid 2025: medium posts
            content =
              "Practical write-up with examples and notes for real projects. " +
              "This guide covers the basics and some intermediate concepts. " +
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " +
              "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
          } else {
            // 2026: longer, detailed posts (popular app, users create quality content)
            const detailLevel =
              monthProgress > 0.7 ? "comprehensive" : "detailed";
            content =
              `In-depth ${detailLevel} guide: ${
                postTitles[globalPostIndex % postTitles.length]
              }. ` +
              "This article provides extensive examples, best practices, and real-world use cases. " +
              "We'll cover multiple approaches, common pitfalls, and advanced techniques. " +
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt. " +
              "Ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. " +
              "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.";
          }

          const author =
            pickUserOfRoleAvailableByDate(role, createdAt) ||
            pickAnyUserAvailableByDate(createdAt);

          // Tag usage varies by time period
          // Early: fewer tags, basic topics
          // Later: more tags, diverse topics
          // (reusing year and monthProgress from above)
          let numTags;
          if (year === 2025 && monthProgress < 0.3) {
            numTags = randInt(1, 3); // Early: 1-3 tags
          } else if (year === 2025) {
            numTags = randInt(2, 4); // Mid: 2-4 tags
          } else {
            numTags = randInt(3, 6); // 2026: 3-6 tags (more diverse)
          }
          const postTags = getRandomItems(tags, numTags).map((t) => t._id);

          batch.push({
            title,
            content,
            author: author._id,
            tags: postTags,
            createdAt,
            updatedAt: createdAt,
          });
        }

        const inserted = await Post.insertMany(batch);
        insertedPosts.push(...inserted);
        made += toMake;
      }
    };

    await makePostsForRole("admin", adminCount);
    await makePostsForRole("user", userCount);

    const done = postsPerMonth.slice(0, mi + 1).reduce((s, x) => s + x, 0);
    console.log(
      `✓ Created posts through ${m.year}-${String(m.month + 1).padStart(
        2,
        "0"
      )} (${done}/${TARGET_POSTS})`
    );
  }

  insertedPosts.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // ---- Comments (split per month per role so stacked area looks great) ----
  // Comment templates vary by time period to show engagement evolution
  const earlyCommentTemplates = [
    "Thanks for sharing!",
    "Helpful, thanks.",
    "Good post.",
    "I'll check this out.",
  ];

  const midCommentTemplates = [
    "Great post! This helped me understand it better.",
    "Thanks for sharing — very useful.",
    "Nice explanation and clean examples.",
    "Question: can you clarify one detail?",
    "I'll try this approach in my next project.",
    "This saved me time — appreciated!",
  ];

  const lateCommentTemplates = [
    "Excellent write-up! This is exactly what I needed for my project.",
    "Thanks for the detailed explanation. The examples really helped clarify things.",
    "Great post! I've been struggling with this and your approach solved it.",
    "Question: have you considered edge case X? I ran into this issue.",
    "I implemented this in production and it's working great. Thanks!",
    "This is a comprehensive guide. Bookmarked for future reference.",
    "Love the depth of this article. The best practices section is gold.",
    "I shared this with my team — we're all learning from it.",
    "Could you expand on section Y? I'd love to see more examples.",
    "This saved me hours of research. The community here is amazing!",
  ];

  const commentBatchSize = 1000;
  let totalCommentsCreated = 0;

  for (let mi = 0; mi < months.length; mi++) {
    const m = months[mi];
    const progress = months.length === 1 ? 1 : mi / (months.length - 1);
    const total = commentsPerMonth[mi];

    const adminCount =
      total > 0
        ? clamp(Math.round(total * adminCommentShare(progress)), 1, total)
        : 0;
    const userCount = total - adminCount;

    const makeCommentsForRole = async (role, count) => {
      let created = 0;
      while (created < count) {
        const batch = [];
        const toMake = Math.min(commentBatchSize, count - created);

        for (let i = 0; i < toMake; i++) {
          const createdAt = randomDateInMonth(m.year, m.month);

          // pick an existing post before this comment, biased toward recent
          const maxPostIdx = binarySearchLastLE(insertedPosts, createdAt, (p) =>
            new Date(p.createdAt).getTime()
          );
          if (maxPostIdx < 0) continue;

          const idx = pickRecentIndex(maxPostIdx + 1, 0.55);
          const post = insertedPosts[idx];

          const author =
            pickUserOfRoleAvailableByDate(role, createdAt) ||
            pickAnyUserAvailableByDate(createdAt);

          // Comment style varies by time period (shows engagement evolution)
          let templates;
          let content = "";
          const year = m.year;
          const monthProgress = mi / months.length;

          if (year === 2025 && monthProgress < 0.3) {
            // Very early: short, simple comments
            templates = earlyCommentTemplates;
            content = templates[randInt(0, templates.length - 1)];
          } else if (year === 2025) {
            // Mid 2025: medium engagement
            templates = midCommentTemplates;
            const base = templates[randInt(0, templates.length - 1)];
            content = base;
          } else {
            // 2026: high engagement, detailed comments (popular app)
            templates = lateCommentTemplates;
            const base = templates[randInt(0, templates.length - 1)];
            // Add enthusiasm indicators for later period
            const enthusiasm =
              monthProgress > 0.7
                ? [
                    " Love how active the platform is!",
                    " The community here is amazing!",
                    "",
                  ]
                : [""];
            content = base + enthusiasm[randInt(0, enthusiasm.length - 1)];
          }

          batch.push({
            post: post._id,
            author: author._id,
            content,
            createdAt,
            updatedAt: createdAt,
          });
        }

        await Comment.insertMany(batch);
        totalCommentsCreated += batch.length;
        created += batch.length;
      }
    };

    await makeCommentsForRole("admin", adminCount);
    await makeCommentsForRole("user", userCount);

    const done = commentsPerMonth.slice(0, mi + 1).reduce((s, x) => s + x, 0);
    console.log(
      `✓ Created comments through ${m.year}-${String(m.month + 1).padStart(
        2,
        "0"
      )} (${done}/${TARGET_COMMENTS})`
    );
  }

  console.log("\n✅ Database seeded successfully!");
  console.log("\nSample login credentials:");
  console.log("  Admin: admin@example.com / password123");
  console.log("  User:  john@example.com / password123");
  console.log("  User:  jane@example.com / password123");
  console.log("  User:  bob@example.com / password123");

  console.log(`\nTotals:`);
  console.log(`  - Users:    ${users.length}`);
  console.log(`  - Profiles: ${profiles.length}`);
  console.log(`  - Tags:     ${tags.length}`);
  console.log(`  - Posts:    ${insertedPosts.length}`);
  console.log(`  - Comments: ${totalCommentsCreated}`);

  console.log(`\nData characteristics for analysis:`);
  console.log(
    `  - Year variation: 2025 (early stage, low activity) vs 2026 (growth phase, high activity)`
  );
  console.log(
    `  - Monthly patterns: Each month has distinct activity levels with seasonal variations`
  );
  console.log(
    `  - Growth trajectory: Clear exponential growth showing app gaining popularity`
  );
  console.log(
    `  - Content evolution: Posts/comments become longer and more detailed over time`
  );
  console.log(
    `  - Engagement patterns: Early simple interactions → Later detailed discussions`
  );
  console.log(
    `  - Role distribution: Admins active early, users dominate as app grows`
  );
}

async function runSeed() {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      "mongodb://mernfinal_user:mernfinal_password@localhost:27017/simple_mern_blog?authSource=admin";

    await connectDB(mongoUri);
    console.log("Connected to MongoDB\n");

    await deleteAllData();
    await seedDatabase();

    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    try {
      await mongoose.connection.close();
    } catch (_) {}
    process.exit(1);
  }
}

runSeed();
