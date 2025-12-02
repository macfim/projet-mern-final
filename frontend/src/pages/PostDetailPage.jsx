import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getCurrentUser } from "../api.js";

export function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [editCommentTexts, setEditCommentTexts] = useState({});
  const [error, setError] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loadingAddComment, setLoadingAddComment] = useState(false);
  const [loadingUpdatePost, setLoadingUpdatePost] = useState(false);
  const [loadingDeletePost, setLoadingDeletePost] = useState(false);
  const [loadingUpdateComment, setLoadingUpdateComment] = useState(null);
  const [loadingDeleteComment, setLoadingDeleteComment] = useState(null);

  async function loadPost() {
    try {
      setError("");
      const data = await api.get(`/posts/${id}`);
      setPost(data);
      setEditTitle(data.title);
      setEditContent(data.content);
      const tagIds = (data.tags || []).map((t) => t._id);
      setSelectedTagIds(tagIds);
    } catch (err) {
      setError(err.message);
    }
  }

  async function loadTags() {
    try {
      const data = await api.get("/tags");
      setAvailableTags(data);
    } catch (err) {
      console.error("Failed to load tags:", err);
    }
  }

  async function loadComments() {
    try {
      const data = await api.get(`/posts/${id}/comments`);
      setComments(data);
    } catch (err) {
      // ignore small errors here
    }
  }

  useEffect(() => {
    loadPost();
    loadComments();
    loadTags();
  }, [id]);

  function toggleTag(tagId) {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  function handleEditPostClick() {
    setIsEditingPost(true);
  }

  function handleCancelEditPost() {
    setIsEditingPost(false);
    // Reset to original values
    setEditTitle(post.title);
    setEditContent(post.content);
    const tagIds = (post.tags || []).map((t) => t._id);
    setSelectedTagIds(tagIds);
  }

  async function handleUpdatePost() {
    try {
      setError("");
      setLoadingUpdatePost(true);
      const updated = await api.put(`/posts/${id}`, {
        title: editTitle,
        content: editContent,
        tagIds: selectedTagIds,
      });
      setPost(updated);
      setIsEditingPost(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUpdatePost(false);
    }
  }

  async function handleDeletePost() {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      setError("");
      setLoadingDeletePost(true);
      await api.delete(`/posts/${id}`);
      navigate("/posts");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDeletePost(false);
    }
  }

  async function handleAddComment(e) {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      setError("");
      setLoadingAddComment(true);
      await api.post(`/posts/${id}/comments`, { content: newComment });
      setNewComment("");
      loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAddComment(false);
    }
  }

  function handleEditCommentClick(commentId, currentContent) {
    setEditingCommentId(commentId);
    setEditCommentTexts((prev) => ({
      ...prev,
      [commentId]: currentContent,
    }));
  }

  function handleCancelEditComment() {
    setEditingCommentId(null);
  }

  async function handleUpdateComment(commentId) {
    const text = editCommentTexts[commentId];
    if (!text) return;
    try {
      setError("");
      setLoadingUpdateComment(commentId);
      await api.put(`/posts/${id}/comments/${commentId}`, { content: text });
      setEditingCommentId(null);
      loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUpdateComment(null);
    }
  }

  async function handleDeleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
      setError("");
      setLoadingDeleteComment(commentId);
      await api.delete(`/posts/${id}/comments/${commentId}`);
      loadComments();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDeleteComment(null);
    }
  }

  if (!post) {
    return (
      <div style={{ padding: "20px", fontSize: "14px", color: "#475569" }}>
        Loading post...
      </div>
    );
  }

  const isAuthor =
    currentUser && post.author && currentUser.id === post.author._id;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h2
          style={{
            marginBottom: "10px",
            fontSize: "28px",
            fontWeight: "bold",
            color: "#0f172a",
          }}
        >
          {post.title}
        </h2>
        <p
          style={{
            marginBottom: "10px",
            fontSize: "14px",
            color: "#334155",
            lineHeight: "1.6",
          }}
        >
          {post.content}
        </p>
        {post.author && (
          <p style={{ fontSize: "12px", color: "#64748b" }}>
            By {post.author.username}
          </p>
        )}
        <p style={{ marginTop: "10px", fontSize: "12px", color: "#64748b" }}>
          Tags: {(post.tags || []).map((t) => t.name).join(", ") || "No tags"}
        </p>
        {error && (
          <p
            style={{
              marginTop: "15px",
              fontSize: "14px",
              color: "#dc2626",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {isAuthor && !isEditingPost && (
        <div style={{ marginBottom: "32px", display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={handleEditPostClick}
            style={{
              borderRadius: "6px",
              backgroundColor: "#0f172a",
              color: "white",
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: "500",
              border: "none",
              cursor: "pointer",
            }}
          >
            Edit Post
          </button>
          <button
            type="button"
            onClick={handleDeletePost}
            disabled={loadingDeletePost}
            style={{
              borderRadius: "6px",
              border: "1px solid #fecaca",
              backgroundColor: "#fef2f2",
              color: "#991b1b",
              padding: "8px 16px",
              fontSize: "12px",
              fontWeight: "500",
              cursor: loadingDeletePost ? "not-allowed" : "pointer",
              opacity: loadingDeletePost ? 0.7 : 1,
            }}
          >
            {loadingDeletePost ? "Deleting..." : "Delete Post"}
          </button>
        </div>
      )}

      {isAuthor && isEditingPost && (
        <div
          style={{
            borderRadius: "6px",
            border: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc",
            padding: "16px",
            marginBottom: "32px",
          }}
        >
          <h3
            style={{
              marginBottom: "12px",
              fontSize: "14px",
              fontWeight: "bold",
              color: "#0f172a",
            }}
          >
            Edit Post
          </h3>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Title
              </label>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  padding: "8px 12px",
                  fontSize: "12px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: "#334155",
                  marginBottom: "4px",
                }}
              >
                Content
              </label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  padding: "8px 12px",
                  fontSize: "12px",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
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
                    gap: "6px",
                  }}
                >
                  {availableTags.map((tag) => (
                    <label
                      key={tag._id}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                        padding: "4px 10px",
                        borderRadius: "16px",
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
                        fontSize: "11px",
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
                    fontSize: "11px",
                    color: "#64748b",
                    fontStyle: "italic",
                  }}
                >
                  No tags available
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={handleUpdatePost}
                disabled={loadingUpdatePost}
                style={{
                  borderRadius: "6px",
                  backgroundColor: "#0f172a",
                  color: "white",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  border: "none",
                  cursor: loadingUpdatePost ? "not-allowed" : "pointer",
                  opacity: loadingUpdatePost ? 0.7 : 1,
                }}
              >
                {loadingUpdatePost ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleCancelEditPost}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #cbd5e1",
                  backgroundColor: "white",
                  color: "#334155",
                  padding: "6px 12px",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3
          style={{
            marginBottom: "12px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#0f172a",
          }}
        >
          Comments
        </h3>
        {currentUser ? (
          <form
            onSubmit={handleAddComment}
            style={{
              marginBottom: "16px",
              display: "flex",
              gap: "10px",
              fontSize: "14px",
            }}
          >
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment"
              style={{
                flex: 1,
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                padding: "8px 12px",
                fontSize: "12px",
                boxSizing: "border-box",
              }}
            />
            <button
              type="submit"
              disabled={loadingAddComment}
              style={{
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                color: "white",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "500",
                border: "none",
                cursor: loadingAddComment ? "not-allowed" : "pointer",
                opacity: loadingAddComment ? 0.7 : 1,
              }}
            >
              {loadingAddComment ? "Adding..." : "Add"}
            </button>
          </form>
        ) : (
          <p
            style={{
              marginBottom: "16px",
              fontSize: "13px",
              color: "#64748b",
              fontStyle: "italic",
            }}
          >
            Please{" "}
            <a href="/login" style={{ color: "#0f172a", fontWeight: "500" }}>
              log in
            </a>{" "}
            to add a comment.
          </p>
        )}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {comments.map((c) => {
            const canEdit =
              currentUser && c.author && currentUser.id === c.author._id;
            const isEditingThisComment = editingCommentId === c._id;
            return (
              <li
                key={c._id}
                style={{
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  padding: "12px",
                }}
              >
                {!isEditingThisComment ? (
                  <>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#1e293b",
                        marginBottom: canEdit ? "8px" : 0,
                      }}
                    >
                      {c.content}{" "}
                      {c.author && (
                        <span style={{ fontSize: "12px", color: "#64748b" }}>
                          — {c.author.username}
                        </span>
                      )}
                    </p>
                    {canEdit && (
                      <div
                        style={{
                          marginTop: "8px",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleEditCommentClick(c._id, c.content)
                          }
                          style={{
                            borderRadius: "6px",
                            backgroundColor: "#0f172a",
                            color: "white",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: "500",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c._id)}
                          disabled={loadingDeleteComment === c._id}
                          style={{
                            borderRadius: "6px",
                            border: "1px solid #fecaca",
                            backgroundColor: "#fef2f2",
                            color: "#991b1b",
                            padding: "4px 10px",
                            fontSize: "11px",
                            fontWeight: "500",
                            cursor: loadingDeleteComment === c._id ? "not-allowed" : "pointer",
                            opacity: loadingDeleteComment === c._id ? 0.7 : 1,
                          }}
                        >
                          {loadingDeleteComment === c._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <input
                      value={editCommentTexts[c._id] || ""}
                      onChange={(e) =>
                        setEditCommentTexts((prev) => ({
                          ...prev,
                          [c._id]: e.target.value,
                        }))
                      }
                      placeholder="Edit comment"
                      style={{
                        width: "100%",
                        borderRadius: "6px",
                        border: "1px solid #cbd5e1",
                        padding: "6px 12px",
                        fontSize: "12px",
                        boxSizing: "border-box",
                      }}
                    />
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateComment(c._id)}
                        disabled={loadingUpdateComment === c._id}
                        style={{
                          borderRadius: "6px",
                          backgroundColor: "#0f172a",
                          color: "white",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          border: "none",
                          cursor: loadingUpdateComment === c._id ? "not-allowed" : "pointer",
                          opacity: loadingUpdateComment === c._id ? 0.7 : 1,
                        }}
                      >
                        {loadingUpdateComment === c._id ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEditComment}
                        disabled={loadingUpdateComment === c._id}
                        style={{
                          borderRadius: "6px",
                          border: "1px solid #cbd5e1",
                          backgroundColor: "white",
                          color: "#334155",
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "500",
                          cursor: loadingUpdateComment === c._id ? "not-allowed" : "pointer",
                          opacity: loadingUpdateComment === c._id ? 0.7 : 1,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {comments.length === 0 && (
            <li style={{ fontSize: "12px", color: "#64748b" }}>
              No comments yet.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
