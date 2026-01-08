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
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  async function loadAll() {
    try {
      setError("");
      setLoading(true);
      setCurrentPage(1);
      const data = await api.get("/posts");
      setPosts(data);
      setFilteredPosts(data);
      setSearchQuery("");
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
      setFilteredPosts(data);
      setSearchQuery("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);

    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author?.username.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
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

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Filter posts by title, content, or author..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading && <Loading message="Loading posts..." />}
      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}
      {!loading && (
        <>
          <ul className="list-none p-0 m-0">
            {(() => {
              const startIndex = (currentPage - 1) * PAGE_SIZE;
              const endIndex = startIndex + PAGE_SIZE;
              const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
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
            {filteredPosts.length === 0 && (
              <li className="p-4 text-base text-slate-600">
                {searchQuery ? "No posts match your search." : "No posts yet."}
              </li>
            )}
          </ul>
          {filteredPosts.length > PAGE_SIZE && (
            <Pagination
              totalItems={filteredPosts.length}
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
