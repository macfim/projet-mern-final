import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, SPACING, TYPOGRAPHY } from "../constants/styles";
import Badge from "./ui/Badge";
import Button from "./ui/Button";

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  const navLinkStyle = {
    color: COLORS.background,
    textDecoration: "none",
    fontWeight: TYPOGRAPHY.fontWeightMedium,
  };

  return (
    <nav
      style={{
        backgroundColor: COLORS.primary,
        padding: `${SPACING.xxxl} ${SPACING.xxxxxl}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", gap: SPACING.xxxl }}>
        <Link to="/" style={navLinkStyle}>
          Home
        </Link>
        <Link to="/posts" style={navLinkStyle}>
          Posts
        </Link>
        <Link to="/analytics" style={navLinkStyle}>
          Analytics
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/new-post" style={navLinkStyle}>
              New Post
            </Link>
            {isAdmin && (
              <>
                <Link to="/tags" style={navLinkStyle}>
                  Tags
                </Link>
                <Link to="/users" style={navLinkStyle}>
                  Users
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ display: "flex", gap: SPACING.xxxl, alignItems: "center" }}>
        {isAuthenticated ? (
          <>
            <Link
              to="/profile"
              style={{
                ...navLinkStyle,
                display: "flex",
                alignItems: "center",
                gap: SPACING.md,
              }}
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
            <Link to="/login" style={navLinkStyle}>
              Login
            </Link>
            <Link to="/register" style={navLinkStyle}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
