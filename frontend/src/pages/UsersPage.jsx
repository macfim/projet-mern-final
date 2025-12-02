import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editNames, setEditNames] = useState({});
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [loadingSave, setLoadingSave] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);

  async function loadUsers() {
    try {
      setError("");
      const data = await api.get("/users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function viewUser(id) {
    try {
      const data = await api.get(`/users/${id}`);
      setSelectedUser(data);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleEditUserClick(userId, currentUsername) {
    setEditingUserId(userId);
    setEditNames((prev) => ({ ...prev, [userId]: currentUsername }));
  }

  function handleCancelEditUser() {
    setEditingUserId(null);
  }

  async function saveName(id) {
    const username = editNames[id];
    if (!username) return;
    try {
      setError("");
      setLoadingSave(id);
      const updated = await api.put(`/users/${id}`, { username });
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setEditingUserId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingSave(null);
    }
  }

  async function deleteUser(id) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      setError("");
      setLoadingDelete(id);
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingDelete(null);
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '16px'
      }}>
        Users
      </h2>
      {error && (
        <p style={{ 
          fontSize: '14px', 
          color: '#dc2626',
          marginBottom: '16px'
        }}>
          {error}
        </p>
      )}
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {users.map((u) => {
          const isEditingThisUser = editingUserId === u._id;
          return (
            <li 
              key={u._id} 
              style={{ 
                padding: '12px 0',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div>
                <p style={{ fontWeight: '500', color: '#0f172a', marginBottom: '4px' }}>
                  {u.username}
                </p>
                <p style={{ fontSize: '12px', color: '#64748b' }}>
                  {u.email}
                </p>
              </div>
              {!isEditingThisUser ? (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  gap: '10px' 
                }}>
                  <button
                    type="button"
                    onClick={() => viewUser(u._id)}
                    style={{
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      color: '#334155',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditUserClick(u._id, u.username)}
                    style={{
                      borderRadius: '6px',
                      backgroundColor: '#0f172a',
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Username
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteUser(u._id)}
                    disabled={loadingDelete === u._id}
                    style={{
                      borderRadius: '6px',
                      border: '1px solid #fecaca',
                      backgroundColor: '#fef2f2',
                      color: '#991b1b',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: loadingDelete === u._id ? 'not-allowed' : 'pointer',
                      opacity: loadingDelete === u._id ? 0.7 : 1
                    }}
                  >
                    {loadingDelete === u._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  alignItems: 'center', 
                  gap: '10px' 
                }}>
                  <input
                    placeholder="New username"
                    value={editNames[u._id] || ""}
                    onChange={(e) =>
                      setEditNames((prev) => ({ ...prev, [u._id]: e.target.value }))
                    }
                    style={{
                      flex: '1',
                      minWidth: '150px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      padding: '6px 8px',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => saveName(u._id)}
                    disabled={loadingSave === u._id}
                    style={{
                      borderRadius: '6px',
                      backgroundColor: '#0f172a',
                      color: 'white',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: loadingSave === u._id ? 'not-allowed' : 'pointer',
                      opacity: loadingSave === u._id ? 0.7 : 1
                    }}
                  >
                    {loadingSave === u._id ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEditUser}
                    disabled={loadingSave === u._id}
                    style={{
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: 'white',
                      color: '#334155',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: loadingSave === u._id ? 'not-allowed' : 'pointer',
                      opacity: loadingSave === u._id ? 0.7 : 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </li>
          );
        })}
        {users.length === 0 && (
          <li style={{ padding: '12px 0', fontSize: '12px', color: '#64748b' }}>
            No users found.
          </li>
        )}
      </ul>

      {selectedUser && (
        <div style={{
          marginTop: '20px',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc',
          padding: '16px',
          fontSize: '12px'
        }}>
          <h3 style={{ 
            marginBottom: '8px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: '#0f172a'
          }}>
            Selected user
          </h3>
          <pre style={{ 
            whiteSpace: 'pre-wrap', 
            color: '#334155',
            margin: 0,
            fontFamily: 'monospace',
            fontSize: '11px'
          }}>
            {JSON.stringify(selectedUser, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

