import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import PageHeader from "../components/ui/PageHeader";

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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <PageHeader title="New Post" />
      <form className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter post title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Content
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={6}
            placeholder="Enter post content"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Tags
          </label>
          {availableTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <label
                  key={tag._id}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border cursor-pointer transition-all ${
                    selectedTagIds.includes(tag._id)
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTagIds.includes(tag._id)}
                    onChange={() => toggleTag(tag._id)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">{tag.name}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              No tags available. Admins can create tags.
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            onClick={handleGenerateAI}
            disabled={loading}
            variant="secondary"
          >
            {loading ? "Generating..." : "✨ Generate with AI"}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            onClick={handleSubmit}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
      {error && (
        <div className="mt-6">
          <ErrorMessage message={error} onDismiss={() => setError("")} />
        </div>
      )}
    </div>
  );
}
