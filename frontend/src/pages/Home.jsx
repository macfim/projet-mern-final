import { useAuth } from "../context/AuthContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Link from "../components/ui/Link";
import { COLORS, SPACING, TYPOGRAPHY } from "../constants/styles";

function Home() {
  const { isAuthenticated } = useAuth();

  const containerStyles = {
    textAlign: "center",
  };

  const titleStyles = {
    fontSize: TYPOGRAPHY.fontSizeXxxxl,
    fontWeight: TYPOGRAPHY.fontWeightBold,
    marginBottom: SPACING.xxl,
    color: COLORS.primary,
  };

  const descriptionStyles = {
    fontSize: TYPOGRAPHY.fontSizeXl,
    color: COLORS.secondary,
    marginBottom: SPACING.xxxxxxl,
    lineHeight: TYPOGRAPHY.lineHeightNormal,
  };

  const buttonContainerStyles = {
    display: "flex",
    gap: SPACING.xxl,
    justifyContent: "center",
    flexWrap: "wrap",
  };

  const linkButtonStyles = {
    padding: `${SPACING.md} ${SPACING.xxl}`,
    textDecoration: "none",
    display: "inline-block",
    cursor: "pointer",
  };

  return (
    <Container>
      <div style={containerStyles}>
        <h1 style={titleStyles}>Welcome</h1>
        <p style={descriptionStyles}>Welcome to our content sharing platform</p>
        <div style={buttonContainerStyles}>
          <Link to="/posts" style={linkButtonStyles}>
            <Button>View Posts</Button>
          </Link>
          {!isAuthenticated && (
            <>
              <Link to="/login" style={linkButtonStyles}>
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/register" style={linkButtonStyles}>
                <Button variant="secondary">Register</Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link to="/new-post" style={linkButtonStyles}>
              <Button variant="secondary">Create a Post</Button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Home;
