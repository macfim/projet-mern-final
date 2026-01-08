import { useEffect, useState } from "react";
import { api } from "../api.js";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import ErrorMessage from "../components/ui/ErrorMessage.jsx";
import Container from "../components/ui/Container.jsx";
import Pagination from "../components/ui/Pagination.jsx";
import Loading from "../components/ui/Loading.jsx";

const PAGE_SIZE = 10;

export function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState({
    users: true,
    save: null,
    delete: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api
      .get("/users")
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading((prev) => ({ ...prev, users: false })));
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(totalPages);
  }, [users.length, currentPage]);

  const startEdit = (id, username) => {
    setEditingId(id);
    setEditValue(username);
  };

  const saveEdit = async (id) => {
    if (!editValue.trim()) return;
    try {
      setError("");
      setLoading((prev) => ({ ...prev, save: id }));
      const updated = await api.put(`/users/${id}`, { username: editValue });
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setEditingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, save: null }));
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      setError("");
      setLoading((prev) => ({ ...prev, delete: id }));
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

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

      {loading.users ? (
        <Loading message="Loading users..." />
      ) : (
        <>
          <ul className="list-none p-0 m-0">
            {paginatedUsers.map((u) => (
              <li key={u._id} className="py-3 border-b border-slate-100">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900">{u.username}</p>
                    <p className="text-sm text-slate-500">{u.email}</p>
                  </div>

                  {editingId === u._id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-40"
                        autoFocus
                      />
                      <Button
                        variant="primary"
                        onClick={() => saveEdit(u._id)}
                        disabled={loading.save === u._id}
                        className="px-3 py-1 text-sm"
                      >
                        {loading.save === u._id ? "..." : "Save"}
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setEditingId(null)}
                        disabled={loading.save === u._id}
                        className="px-3 py-1 text-sm"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="primary"
                        onClick={() => startEdit(u._id, u.username)}
                        className="px-3 py-1 text-sm"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteUser(u._id)}
                        disabled={loading.delete === u._id}
                        className="px-3 py-1 text-sm"
                      >
                        {loading.delete === u._id ? "..." : "Delete"}
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
            {users.length === 0 && (
              <li className="py-4 text-sm text-slate-500">No users found.</li>
            )}
          </ul>

          {users.length > PAGE_SIZE && (
            <Pagination
              totalItems={users.length}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </Container>
  );
}
