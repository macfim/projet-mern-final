import { useEffect, useState } from "react";
import { api } from "../api.js";
import Container from "../components/ui/Container";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import Link from "../components/ui/Link";
import Pagination from "../components/ui/Pagination";

const PAGE_SIZE = 10;

export function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  async function loadAll() {
    try {
      setError("");
      setLoading(true);
      setCurrentPage(1);
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
      setCurrentPage(1);
      const data = await api.get("/posts/me");
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(newPage) {
    setCurrentPage(newPage);
  }

  useEffect(() => {
    loadAll();
  }, []);

  const filterActions = (
    <div className="flex gap-8">
      <Button variant="secondary" onClick={loadAll} disabled={loading}>
        All posts
      </Button>
      <Button variant="secondary" onClick={loadMine} disabled={loading}>
        My posts
      </Button>
    </div>
  );

  return (
    <Container>
      <PageHeader title="Posts" actions={filterActions} />
      {loading && <Loading message="Loading posts..." />}
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
      {!loading && (
        <>
          <ul className="list-none p-0 m-0">
            {(() => {
              const startIndex = (currentPage - 1) * PAGE_SIZE;
              const endIndex = startIndex + PAGE_SIZE;
              const paginatedPosts = posts.slice(startIndex, endIndex);
              return paginatedPosts.map((p) => (
                <li key={p._id} className="py-4 border-b border-slate-300">
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <Link to={`/posts/${p._id}`} variant="primary">
                        {p.title}
                      </Link>
                      {p.author && (
                        <span className="text-sm text-slate-600 ml-3">
                          by {p.author.username}
                        </span>
                      )}
                    </div>
                    {p.createdAt && (
                      <span className="text-sm text-slate-500 whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>
                </li>
              ));
            })()}
            {posts.length === 0 && (
              <li className="p-4 text-base text-slate-600">No posts yet.</li>
            )}
          </ul>
          {posts.length > PAGE_SIZE && (
            <Pagination
              totalItems={posts.length}
              currentPage={currentPage}
              pageSize={PAGE_SIZE}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </Container>
  );
}
