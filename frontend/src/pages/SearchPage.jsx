import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api";
import Container from "../components/ui/Container";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loading from "../components/ui/Loading";
import ErrorMessage from "../components/ui/ErrorMessage";
import Link from "../components/ui/Link";
import Badge from "../components/ui/Badge";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("q");
    const t = searchParams.get("type") || "all";
    if (q) {
      setQuery(q);
      setType(t);
      performSearch(q, t);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery, searchType) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError("");
    try {
      const data = await api.get(
        `/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
      );
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query, type });
    }
  };

  const typeButtons = (
    <div className="flex gap-2">
      {["all", "posts", "users", "tags", "comments"].map((t) => (
        <Button
          key={t}
          variant={type === t ? "primary" : "secondary"}
          onClick={() => setType(t)}
          className="px-3 py-1 text-xs"
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </Button>
      ))}
    </div>
  );

  return (
    <Container>
      <PageHeader title="Search" actions={typeButtons} />

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-3">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts, users, tags, comments..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            Search
          </Button>
        </div>
      </form>

      {loading && <Loading message="Searching..." />}

      {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

      {results && !loading && (
        <div>
          <p className="text-sm text-slate-500 mb-6">
            Found {results.total} result{results.total !== 1 ? "s" : ""} for "
            {results.query}"
          </p>

          {results.posts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Posts ({results.posts.length})
              </h2>
              <ul className="list-none p-0 m-0">
                {results.posts.map((post) => (
                  <li key={post._id} className="py-4 border-b border-slate-300">
                    <Link to={`/posts/${post._id}`} variant="primary">
                      {post.title}
                    </Link>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>by {post.author?.username}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      {post.tags?.length > 0 && (
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <Badge key={tag._id} variant="info">
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.users.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Users ({results.users.length})
              </h2>
              <ul className="list-none p-0 m-0">
                {results.users.map((user) => (
                  <li key={user._id} className="py-3 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">
                          {user.username}
                        </p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                      {user.role === "admin" && (
                        <Badge variant="info">Admin</Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Tags ({results.tags.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {results.tags.map((tag) => (
                  <span
                    key={tag._id}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium border border-slate-200 bg-slate-100 text-slate-800"
                  >
                    <span>{tag.name}</span>
                    <span className="text-xs uppercase tracking-wider text-slate-400">
                      {tag.slug}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {results.comments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">
                Comments ({results.comments.length})
              </h2>
              <ul className="list-none p-0 m-0">
                {results.comments.map((comment) => (
                  <li
                    key={comment._id}
                    className="py-3 border-b border-slate-100"
                  >
                    <p className="text-sm text-slate-700">{comment.content}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>by {comment.author?.username}</span>
                      <span>
                        on{" "}
                        <Link
                          to={`/posts/${comment.post?._id}`}
                          variant="primary"
                        >
                          {comment.post?.title}
                        </Link>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {results.total === 0 && (
            <p className="text-center py-12 text-sm text-slate-500">
              No results found. Try a different search term.
            </p>
          )}
        </div>
      )}
    </Container>
  );
}
