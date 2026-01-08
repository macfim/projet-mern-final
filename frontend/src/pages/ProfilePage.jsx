import { useEffect, useState } from "react";
import { api } from "../api.js";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import Card from "../components/ui/Card";
import ErrorMessage from "../components/ui/ErrorMessage";
import Loading from "../components/ui/Loading";

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  async function loadProfile() {
    try {
      setError("");
      setLoadingProfile(true);
      const data = await api.get("/profiles/me");
      setProfile(data);
      setBio(data.bio || "");
      setAvatarUrl(data.avatarUrl || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingProfile(false);
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

  if (loadingProfile) {
    return (
      <Container>
        <Loading message="Loading profile..." />
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <ErrorMessage message="Profile not found" />
      </Container>
    );
  }

  return (
    <Container maxWidth="600px">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">My Profile</h2>
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
          className="mb-4"
        />
      )}
      <Card className="mb-4">
        <p className="text-slate-800 mb-2">
          <span className="font-medium">Username:</span>{" "}
          {profile.user && profile.user.username}
        </p>
        <p className="text-slate-800 mb-2">
          <span className="font-medium">Email:</span>{" "}
          {profile.user && profile.user.email}
        </p>
        <p className="text-slate-800">
          <span className="font-medium">Role:</span>{" "}
          <span
            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              profile.user && profile.user.role === "admin"
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {profile.user && profile.user.role}
          </span>
        </p>
      </Card>
      {!isEditing ? (
        <div>
          <Card className="mb-4">
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-600 mb-1">Bio</p>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                {profile.bio || (
                  <span className="italic text-slate-400">No bio set</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-600 mb-1">
                Avatar URL
              </p>
              <p className="text-sm text-slate-800 break-all">
                {profile.avatarUrl || (
                  <span className="italic text-slate-400">
                    No avatar URL set
                  </span>
                )}
              </p>
            </div>
          </Card>
          <Button onClick={handleEditClick}>Edit Profile</Button>
        </div>
      ) : (
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Bio
            </label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Avatar URL
            </label>
            <Input
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancelEdit}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </Container>
  );
}
