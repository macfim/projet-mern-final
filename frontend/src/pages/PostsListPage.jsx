import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";

export function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadAll() {
    try {
      setError("");
      setLoading(true);
      const data = await api.get("/posts");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadMine() {
    try {
      setError("");
      setLoading(true);
      const data = await api.get("/posts/me");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Posts</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={loadAll}
            disabled={loading}
            style={{
              padding: '8px 16px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#334155',
              backgroundColor: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Loading...' : 'All posts'}
          </button>
          <button
            type="button"
            onClick={loadMine}
            disabled={loading}
            style={{
              padding: '8px 16px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#334155',
              backgroundColor: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Loading...' : 'My posts'}
          </button>
        </div>
      </div>
      {error && (
        <p style={{ 
          marginBottom: '15px', 
          fontSize: '14px', 
          color: '#dc2626' 
        }}>
          {error}
        </p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {posts.map((p) => (
          <li 
            key={p._id} 
            style={{ 
              padding: '12px 0',
              borderBottom: '1px solid #f1f5f9'
            }}
          >
            <Link
              to={`/posts/${p._id}`}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#0f172a',
                textDecoration: 'none'
              }}
            >
              {p.title}
            </Link>{" "}
            {p.author && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                by {p.author.username}
              </span>
            )}
          </li>
        ))}
        {posts.length === 0 && (
          <li style={{ padding: '12px 0', fontSize: '14px', color: '#64748b' }}>
            No posts yet.
          </li>
        )}
      </ul>
    </div>
  );
}

