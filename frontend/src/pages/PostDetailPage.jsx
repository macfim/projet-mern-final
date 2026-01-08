import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, getCurrentUser } from "../api.js";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Card from "../components/ui/Card";
import ErrorMessage from "../components/ui/ErrorMessage";

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
    return <div className="p-5 text-sm text-slate-600">Loading post...</div>;
  }

  const isAuthor =
    currentUser && post.author && currentUser.id === post.author._id;

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="mb-2.5 text-2xl font-bold text-slate-900">
          {post.title}
        </h2>
        <p className="mb-2.5 text-sm text-slate-700 leading-relaxed">
          {post.content}
        </p>
        {post.author && (
          <p className="text-xs text-slate-500">By {post.author.username}</p>
        )}
        <p className="mt-2.5 text-xs text-slate-500">
          Tags: {(post.tags || []).map((t) => t.name).join(", ") || "No tags"}
        </p>
        {error && (
          <div className="mt-4">
            <ErrorMessage message={error} onDismiss={() => setError("")} />
          </div>
        )}
      </div>

      {isAuthor && !isEditingPost && (
        <div className="mb-8 flex gap-2.5">
          <Button onClick={handleEditPostClick}>Edit Post</Button>
          <Button
            variant="danger"
            onClick={handleDeletePost}
            disabled={loadingDeletePost}
          >
            {loadingDeletePost ? "Deleting..." : "Delete Post"}
          </Button>
        </div>
      )}

      {isAuthor && isEditingPost && (
        <Card className="mb-8">
          <h3 className="mb-3 text-sm font-bold text-slate-900">Edit Post</h3>
          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Title
              </label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Content
              </label>
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-2">
                Tags
              </label>
              {availableTags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <label
                      key={tag._id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer transition-all ${
                        selectedTagIds.includes(tag._id)
                          ? "bg-slate-900 text-white border-slate-900"
                          : "bg-white text-slate-700 border-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedTagIds.includes(tag._id)}
                        onChange={() => toggleTag(tag._id)}
                        className="hidden"
                      />
                      {tag.name}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No tags available
                </p>
              )}
            </div>
            <div className="flex gap-2.5">
              <Button onClick={handleUpdatePost} disabled={loadingUpdatePost}>
                {loadingUpdatePost ? "Saving..." : "Save"}
              </Button>
              <Button variant="secondary" onClick={handleCancelEditPost}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-900">Comments</h3>
        {currentUser ? (
          <form onSubmit={handleAddComment} className="mb-4 flex gap-2.5">
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment"
              className="flex-1"
            />
            <Button type="submit" disabled={loadingAddComment}>
              {loadingAddComment ? "Adding..." : "Add"}
            </Button>
          </form>
        ) : (
          <p className="mb-4 text-xs text-slate-500 italic">
            Please{" "}
            <a href="/login" className="text-slate-900 font-medium">
              log in
            </a>{" "}
            to add a comment.
          </p>
        )}
        <ul className="list-none p-0 m-0 flex flex-col gap-3">
          {comments.map((c) => {
            const canEdit =
              currentUser && c.author && currentUser.id === c.author._id;
            const isEditingThisComment = editingCommentId === c._id;
            return (
              <li
                key={c._id}
                className="rounded-lg border border-slate-300 bg-slate-50 p-3"
              >
                {!isEditingThisComment ? (
                  <>
                    <p
                      className={`text-sm text-slate-900 ${
                        canEdit ? "mb-2" : ""
                      }`}
                    >
                      {c.content}{" "}
                      {c.author && (
                        <span className="text-xs text-slate-500">
                          — {c.author.username}
                        </span>
                      )}
                    </p>
                    {canEdit && (
                      <div className="mt-2 flex gap-2.5">
                        <Button
                          variant="primary"
                          onClick={() =>
                            handleEditCommentClick(c._id, c.content)
                          }
                          className="px-2.5 py-1 text-xs"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteComment(c._id)}
                          disabled={loadingDeleteComment === c._id}
                          className="px-2.5 py-1 text-xs"
                        >
                          {loadingDeleteComment === c._id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={editCommentTexts[c._id] || ""}
                      onChange={(e) =>
                        setEditCommentTexts((prev) => ({
                          ...prev,
                          [c._id]: e.target.value,
                        }))
                      }
                      placeholder="Edit comment"
                    />
                    <div className="flex gap-2.5">
                      <Button
                        onClick={() => handleUpdateComment(c._id)}
                        disabled={loadingUpdateComment === c._id}
                        className="px-3 py-1.5 text-xs"
                      >
                        {loadingUpdateComment === c._id ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCancelEditComment}
                        disabled={loadingUpdateComment === c._id}
                        className="px-3 py-1.5 text-xs"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          {comments.length === 0 && (
            <li className="text-xs text-slate-500">No comments yet.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
