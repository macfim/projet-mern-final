-- DW: simple_mern_blog (Star Schema) - Bare Minimum
PRAGMA foreign_keys = ON;
DROP TABLE IF EXISTS FactPost;
DROP TABLE IF EXISTS DimPost;
DROP TABLE IF EXISTS DimUser;
DROP TABLE IF EXISTS DimDate;
CREATE TABLE DimDate (
  date_id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL UNIQUE,
  -- 'YYYY-MM-DD'
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  day INTEGER NOT NULL
);
CREATE TABLE DimUser (
  user_key INTEGER PRIMARY KEY AUTOINCREMENT,
  mongo_user_id TEXT NOT NULL UNIQUE,
  -- users._id from Mongo
  username TEXT,
  email TEXT,
  role TEXT
);
CREATE TABLE DimPost (
  post_key INTEGER PRIMARY KEY AUTOINCREMENT,
  mongo_post_id TEXT NOT NULL UNIQUE,
  -- posts._id from Mongo
  title TEXT
);
CREATE TABLE FactPost (
  fact_id INTEGER PRIMARY KEY AUTOINCREMENT,
  date_id INTEGER NOT NULL,
  user_key INTEGER NOT NULL,
  post_key INTEGER NOT NULL,
  post_count INTEGER NOT NULL DEFAULT 1,
  comments_count INTEGER NOT NULL DEFAULT 0,
  tags_count INTEGER NOT NULL DEFAULT 0,
  content_length INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY(date_id) REFERENCES DimDate(date_id),
  FOREIGN KEY(user_key) REFERENCES DimUser(user_key),
  FOREIGN KEY(post_key) REFERENCES DimPost(post_key)
);
CREATE INDEX idx_fact_date ON FactPost(date_id);
CREATE INDEX idx_fact_user ON FactPost(user_key);
CREATE INDEX idx_fact_post ON FactPost(post_key);