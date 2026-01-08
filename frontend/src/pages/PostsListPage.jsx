import { useEffect, useState } from "react";
import { api } from "../api.js";
import Container from "../components/ui/Container";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import Link from "../components/ui/Link";
import Pagination from "../components/ui/Pagination";
import { SPACING, COLORS, TYPOGRAPHY, BORDERS } from "../constants/styles";

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
    <div style={{ display: "flex", gap: SPACING.xxl }}>
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
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {(() => {
              const startIndex = (currentPage - 1) * PAGE_SIZE;
              const endIndex = startIndex + PAGE_SIZE;
              const paginatedPosts = posts.slice(startIndex, endIndex);
              return paginatedPosts.map((p) => (
                <li
                  key={p._id}
                  style={{
                    padding: `${SPACING.lg} 0`,
                    borderBottom: `${BORDERS.width} solid ${COLORS.lightGray}`,
                  }}
                >
                  <Link to={`/posts/${p._id}`} variant="primary">
                    {p.title}
                  </Link>
                  {p.author && (
                    <span
                      style={{
                        fontSize: TYPOGRAPHY.fontSizeSm,
                        color: COLORS.textLight,
                        marginLeft: SPACING.md,
                      }}
                    >
                      by {p.author.username}
                    </span>
                  )}
                </li>
              ));
            })()}
            {posts.length === 0 && (
              <li
                style={{
                  padding: SPACING.lg,
                  fontSize: TYPOGRAPHY.fontSizeMd,
                  color: COLORS.textLight,
                }}
              >
                No posts yet.
              </li>
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
