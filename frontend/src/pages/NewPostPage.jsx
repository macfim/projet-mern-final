import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";

export function NewPostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadTags();
  }, []);

  async function loadTags() {
    try {
      const data = await api.get("/tags");
      setAvailableTags(data);
    } catch (err) {
      // Silently fail if tags can't be loaded
      console.error("Failed to load tags:", err);
    }
  }

  function toggleTag(tagId) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const post = await api.post("/posts", {
        title,
        content,
        tagIds: selectedTagIds,
      });
      navigate(`/posts/${post._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateAI() {
    setError("");
    setLoading(true);
    try {
      const generated = await api.post("/posts/generate");
      setTitle(generated.title);
      setContent(generated.content);
      if (generated.tagIds && Array.isArray(generated.tagIds)) {
        setSelectedTagIds(generated.tagIds);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "20px" }}>
      <h2
        style={{
          marginBottom: "24px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#0f172a",
        }}
      >
        New Post
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#334155",
              marginBottom: "4px",
            }}
          >
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              padding: "10px 12px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#334155",
              marginBottom: "4px",
            }}
          >
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            style={{
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #cbd5e1",
              padding: "10px 12px",
              fontSize: "14px",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              color: "#334155",
              marginBottom: "8px",
            }}
          >
            Tags
          </label>
          {availableTags.length > 0 ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {availableTags.map((tag) => (
                <label
                  key={tag._id}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: selectedTagIds.includes(tag._id)
                      ? "#0f172a"
                      : "#cbd5e1",
                    backgroundColor: selectedTagIds.includes(tag._id)
                      ? "#0f172a"
                      : "white",
                    color: selectedTagIds.includes(tag._id)
                      ? "white"
                      : "#334155",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag._id)}
                    onChange={() => toggleTag(tag._id)}
                    style={{ display: "none" }}
                  />
                  {tag.name}
                </label>
              ))}
            </div>
          ) : (
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                fontStyle: "italic",
              }}
            >
              No tags available. Admins can create tags.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleGenerateAI}
          disabled={loading}
          style={{
            borderRadius: "6px",
            backgroundColor: "#8b5cf6",
            color: "white",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "500",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Generating..." : "✨ Generate with AI"}
        </button>
        <button
          type="submit"
          disabled={loading}
          style={{
            borderRadius: "6px",
            backgroundColor: "#0f172a",
            color: "white",
            padding: "10px 16px",
            fontSize: "14px",
            fontWeight: "500",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Creating..." : "Create"}
        </button>
      </form>
      {error && (
        <p
          style={{
            marginTop: "16px",
            fontSize: "14px",
            color: "#dc2626",
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
