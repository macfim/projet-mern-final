import React, { useEffect, useState } from "react";
import { api } from "../api.js";

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function loadProfile() {
    try {
      setError("");
      const data = await api.get("/profiles/me");
      setProfile(data);
      setBio(data.bio || "");
      setAvatarUrl(data.avatarUrl || "");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleCancelEdit() {
    setIsEditing(false);
    // Reset to original values
    setBio(profile?.bio || "");
    setAvatarUrl(profile?.avatarUrl || "");
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      const updated = await api.put("/profiles/me", { bio, avatarUrl });
      setProfile(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!profile) {
    return (
      <div style={{ padding: '20px', fontSize: '14px', color: '#475569' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ 
        fontSize: '24px', 
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: '16px'
      }}>
        My Profile
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
      <div style={{
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc',
        padding: '16px',
        fontSize: '14px',
        marginBottom: '16px'
      }}>
        <p style={{ color: '#1e293b', marginBottom: '8px' }}>
          <span style={{ fontWeight: '500' }}>Username:</span>{" "}
          {profile.user && profile.user.username}
        </p>
        <p style={{ color: '#1e293b', marginBottom: '8px' }}>
          <span style={{ fontWeight: '500' }}>Email:</span>{" "}
          {profile.user && profile.user.email}
        </p>
        <p style={{ color: '#1e293b' }}>
          <span style={{ fontWeight: '500' }}>Role:</span>{" "}
          <span style={{
            display: 'inline-block',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: profile.user && profile.user.role === 'admin' ? '#dbeafe' : '#f1f5f9',
            color: profile.user && profile.user.role === 'admin' ? '#1e40af' : '#475569'
          }}>
            {profile.user && profile.user.role}
          </span>
        </p>
      </div>
      {!isEditing ? (
        <div>
          <div style={{
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ marginBottom: '16px' }}>
              <p style={{ 
                fontSize: '12px', 
                fontWeight: '500',
                color: '#334155',
                marginBottom: '6px'
              }}>
                Bio
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#1e293b',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {profile.bio || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No bio set</span>}
              </p>
            </div>
            <div>
              <p style={{ 
                fontSize: '12px', 
                fontWeight: '500',
                color: '#334155',
                marginBottom: '6px'
              }}>
                Avatar URL
              </p>
              <p style={{ 
                fontSize: '14px', 
                color: '#1e293b',
                wordBreak: 'break-all'
              }}>
                {profile.avatarUrl || <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>No avatar URL set</span>}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleEditClick}
            style={{
              borderRadius: '6px',
              backgroundColor: '#0f172a',
              color: 'white',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '12px', 
              fontWeight: '500',
              color: '#334155',
              marginBottom: '4px'
            }}>
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              style={{
                width: '100%',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                padding: '8px 12px',
                fontSize: '12px',
                boxSizing: 'border-box',
                fontFamily: 'inherit'
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
              Avatar URL
            </label>
            <input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
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
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                borderRadius: '6px',
                backgroundColor: '#0f172a',
                color: 'white',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '500',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              disabled={loading}
              style={{
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: 'white',
                color: '#334155',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: '500',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

