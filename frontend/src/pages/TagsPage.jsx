import React, { useEffect, useState } from "react";
import { api } from "../api.js";
import Pagination from "../components/ui/Pagination";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

export function TagsPage() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [loadingTags, setLoadingTags] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 20;

  async function loadTags() {
    try {
      setError("");
      setLoadingTags(true);
      const data = await api.get("/tags");
      setTags(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTags(false);
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(tags.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [tags.length]);

  async function viewTag(id) {
    try {
      const data = await api.get(`/tags/${id}`);
      setSelectedTag(data);
      setName(data.name);
      setSlug(data.slug);
    } catch (err) {
      setError(err.message);
    }
  }

  async function createTag(e) {
    e.preventDefault();
    try {
      setError("");
      setLoadingSubmit(true);
      await api.post("/tags", { name, slug });
      setName("");
      setSlug("");
      setSelectedTag(null);
      loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  }

  async function updateTag(e) {
    e.preventDefault();
    if (!selectedTag) return;
    try {
      setError("");
      setLoadingSubmit(true);
      await api.put(`/tags/${selectedTag._id}`, { name, slug });
      loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  }

  async function deleteTag(id) {
    try {
      setError("");
      setLoadingDelete(id);
      await api.delete(`/tags/${id}`);
      if (selectedTag && selectedTag._id === id) {
        setSelectedTag(null);
        setName("");
        setSlug("");
      }
      loadTags();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDelete(null);
    }
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedTags = tags.slice(startIndex, endIndex);

  return (
    <div className="p-5 max-w-6xl mx-auto grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Tags</h2>
          <span className="text-xs text-slate-500">
            {tags.length} tag{tags.length === 1 ? "" : "s"}
          </span>
        </div>
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={() => setError("")}
            className="mb-4"
          />
        )}
        {loadingTags ? (
          <Loading message="Loading tags..." />
        ) : (
          <ul className="list-none p-0 m-0 flex flex-wrap gap-2.5">
            {paginatedTags.map((t) => (
              <li key={t._id}>
                <button
                  type="button"
                  onClick={() => viewTag(t._id)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    selectedTag && selectedTag._id === t._id
                      ? "border border-slate-900 bg-slate-900 text-white"
                      : "border border-slate-200 bg-slate-100 text-slate-800"
                  }`}
                >
                  <span>{t.name}</span>
                  <span
                    className={`text-xs uppercase tracking-wider ${
                      selectedTag && selectedTag._id === t._id
                        ? "text-white/70"
                        : "text-slate-400"
                    }`}
                  >
                    {t.slug}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (loadingDelete !== t._id) {
                        deleteTag(t._id);
                      }
                    }}
                    className={`rounded-full bg-black/10 px-1.5 py-0.5 text-xs ${
                      selectedTag && selectedTag._id === t._id
                        ? "text-white/90"
                        : "text-slate-500"
                    } ${
                      loadingDelete === t._id
                        ? "cursor-wait opacity-50"
                        : "cursor-pointer"
                    }`}
                  >
                    {loadingDelete === t._id ? "..." : "✕"}
                  </span>
                </button>
              </li>
            ))}
            {tags.length === 0 && (
              <li className="text-xs text-slate-500">No tags yet.</li>
            )}
          </ul>
        )}
        {!loadingTags && (
          <Pagination
            totalItems={tags.length}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <div className="col-span-1">
        <Card className="bg-slate-50">
          <h3 className="mb-3 text-sm font-bold text-slate-900">
            {selectedTag ? "Edit tag" : "Create tag"}
          </h3>
          <form
            onSubmit={selectedTag ? updateTag : createTag}
            className="flex flex-col gap-3"
          >
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">
                Slug
              </label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <Button
              type="submit"
              disabled={loadingSubmit}
              className="self-start px-4 py-1.5 text-xs"
            >
              {loadingSubmit
                ? selectedTag
                  ? "Updating..."
                  : "Creating..."
                : selectedTag
                ? "Update tag"
                : "Create tag"}
            </Button>
          </form>

          {selectedTag && (
            <div className="mt-4 rounded border border-slate-200 bg-white p-3">
              <h4 className="mb-1 text-xs font-bold text-slate-900">
                Selected tag raw data
              </h4>
              <pre className="m-0 whitespace-pre-wrap font-mono text-xs text-slate-700">
                {JSON.stringify(selectedTag, null, 2)}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
