import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export function TagsPage() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);

  async function loadTags() {
    try {
      setError("");
      const data = await api.get("/tags");
      setTags(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadTags();
  }, []);

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

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '2fr 1.5fr',
      gap: '32px'
    }}>
      <div>
        <div style={{ 
          marginBottom: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold',
            color: '#0f172a',
            margin: 0
          }}>
            Tags
          </h2>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            {tags.length} tag{tags.length === 1 ? "" : "s"}
          </span>
        </div>
        {error && (
          <p style={{ 
            marginBottom: '12px', 
            fontSize: '14px', 
            color: '#dc2626' 
          }}>
            {error}
          </p>
        )}
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          {tags.map((t) => (
            <li key={t._id}>
              <button
                type="button"
                onClick={() => viewTag(t._id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  borderRadius: '9999px',
                  border: selectedTag && selectedTag._id === t._id 
                    ? '1px solid #0f172a' 
                    : '1px solid #e2e8f0',
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  backgroundColor: selectedTag && selectedTag._id === t._id 
                    ? '#0f172a' 
                    : '#f1f5f9',
                  color: selectedTag && selectedTag._id === t._id 
                    ? 'white' 
                    : '#1e293b',
                  cursor: 'pointer'
                }}
              >
                <span>{t.name}</span>
                <span style={{ 
                  fontSize: '10px', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em',
                  color: selectedTag && selectedTag._id === t._id 
                    ? 'rgba(255,255,255,0.7)' 
                    : '#94a3b8'
                }}>
                  {t.slug}
                </span>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (loadingDelete !== t._id) {
                      deleteTag(t._id);
                    }
                  }}
                  style={{
                    cursor: loadingDelete === t._id ? 'wait' : 'pointer',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    padding: '2px 6px',
                    fontSize: '10px',
                    color: selectedTag && selectedTag._id === t._id 
                      ? 'rgba(255,255,255,0.9)' 
                      : '#64748b',
                    opacity: loadingDelete === t._id ? 0.5 : 1
                  }}
                >
                  {loadingDelete === t._id ? '...' : '✕'}
                </span>
              </button>
            </li>
          ))}
          {tags.length === 0 && (
            <li style={{ fontSize: '12px', color: '#64748b' }}>
              No tags yet.
            </li>
          )}
        </ul>
      </div>

      <div style={{
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        padding: '16px',
        fontSize: '14px'
      }}>
        <h3 style={{ 
          marginBottom: '12px', 
          fontSize: '14px', 
          fontWeight: 'bold',
          color: '#0f172a'
        }}>
          {selectedTag ? "Edit tag" : "Create tag"}
        </h3>
        <form
          onSubmit={selectedTag ? updateTag : createTag}
          style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        >
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500',
              color: '#334155',
              marginBottom: '4px'
            }}>
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                padding: '8px 12px',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500',
              color: '#334155',
              marginBottom: '4px'
            }}>
              Slug
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              style={{
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                padding: '8px 12px',
                fontSize: '12px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loadingSubmit}
            style={{
              borderRadius: '6px',
              backgroundColor: '#0f172a',
              color: 'white',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500',
              border: 'none',
              cursor: loadingSubmit ? 'not-allowed' : 'pointer',
              opacity: loadingSubmit ? 0.7 : 1,
              alignSelf: 'flex-start'
            }}
          >
            {loadingSubmit 
              ? (selectedTag ? "Updating..." : "Creating...") 
              : (selectedTag ? "Update tag" : "Create tag")}
          </button>
        </form>

        {selectedTag && (
          <div style={{
            marginTop: '16px',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'white',
            padding: '12px',
            fontSize: '11px',
            color: '#334155'
          }}>
            <h4 style={{ 
              marginBottom: '4px', 
              fontSize: '12px', 
              fontWeight: 'bold',
              color: '#0f172a'
            }}>
              Selected tag raw data
            </h4>
            <pre style={{ 
              whiteSpace: 'pre-wrap',
              margin: 0,
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>
              {JSON.stringify(selectedTag, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

