import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav className="bg-slate-900 px-20 py-6 flex justify-between items-center">
      <div className="flex gap-6">
        <Link to="/" className="text-white font-medium no-underline">
          Home
        </Link>
        <Link to="/search" className="text-white font-medium no-underline">
          Search
        </Link>
        <Link to="/posts" className="text-white font-medium no-underline">
          Posts
        </Link>
        <Link to="/analytics" className="text-white font-medium no-underline">
          Analytics
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to="/new-post"
              className="text-white font-medium no-underline"
            >
              New Post
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/tags"
                  className="text-white font-medium no-underline"
                >
                  Tags
                </Link>
                <Link
                  to="/users"
                  className="text-white font-medium no-underline"
                >
                  Users
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div className="flex gap-6 items-center">
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              className="text-white font-medium no-underline flex items-center gap-3"
            >
              <span>Profile ({user?.username})</span>
              {isAdmin && <Badge variant="info">Admin</Badge>}
            </Link>
            <Button variant="danger" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-white font-medium no-underline">
              Login
            </Link>
            <Link
              to="/register"
              className="text-white font-medium no-underline"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
