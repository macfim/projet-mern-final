import { useEffect, useState } from "react";
import { api } from "../api.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Container from "../components/ui/Container.jsx";
import Card from "../components/ui/Card.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Loading from "../components/ui/Loading.jsx";

const PAGE_SIZE = 10;

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editNames, setEditNames] = useState({});
  const [error, setError] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [loadingSave, setLoadingSave] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadUsers() {
    try {
      setError("");
      setLoadingUsers(true);
      const data = await api.get("/users");
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [users.length, currentPage]);

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

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedUsers = users.slice(startIndex, endIndex);

  return (
    <Container maxWidth="800px" padding="20px">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Users</h2>
      {error && (
        <ErrorMessage
          message={error}
          onDismiss={() => setError("")}
          className="mb-4"
        />
      )}
      {loadingUsers ? (
        <Loading message="Loading users..." />
      ) : (
        <ul className="list-none p-0 m-0">
          {paginatedUsers.map((u) => {
            const isEditingThisUser = editingUserId === u._id;
            return (
              <li
                key={u._id}
                className="py-3 border-b border-slate-100 flex flex-col gap-2"
              >
                <div>
                  <p className="font-medium text-slate-900 mb-1">
                    {u.username}
                  </p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                {!isEditingThisUser ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => viewUser(u._id)}
                      className="px-3 py-1 text-xs"
                    >
                      View
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => handleEditUserClick(u._id, u.username)}
                      className="px-3 py-1 text-xs"
                    >
                      Edit Username
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => deleteUser(u._id)}
                      disabled={loadingDelete === u._id}
                      className="px-3 py-1 text-xs"
                    >
                      {loadingDelete === u._id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <Input
                      placeholder="New username"
                      value={editNames[u._id] || ""}
                      onChange={(e) =>
                        setEditNames((prev) => ({
                          ...prev,
                          [u._id]: e.target.value,
                        }))
                      }
                      className="flex-1 min-w-[150px] text-xs"
                    />
                    <Button
                      variant="primary"
                      onClick={() => saveName(u._id)}
                      disabled={loadingSave === u._id}
                      className="px-3 py-1 text-xs"
                    >
                      {loadingSave === u._id ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancelEditUser}
                      disabled={loadingSave === u._id}
                      className="px-3 py-1 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
          {users.length === 0 && (
            <li className="py-3 text-xs text-slate-500">No users found.</li>
          )}
        </ul>
      )}

      {!loadingUsers && users.length > PAGE_SIZE && (
        <Pagination
          totalItems={users.length}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          onPageChange={handlePageChange}
        />
      )}

      {selectedUser && (
        <Card className="mt-5">
          <h3 className="mb-2 text-sm font-bold text-slate-900">
            Selected user
          </h3>
          <pre className="whitespace-pre-wrap text-slate-600 m-0 font-mono text-xs">
            {JSON.stringify(selectedUser, null, 2)}
          </pre>
        </Card>
      )}
    </Container>
  );
}
