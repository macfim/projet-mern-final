import { useAuth } from "../context/AuthContext";
import Container from "../components/ui/Container";
import Button from "../components/ui/Button";
import Link from "../components/ui/Link";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8 text-slate-900">Welcome</h1>
        <p className="text-xl text-slate-600 mb-16 leading-normal">
          Welcome to our content sharing platform
        </p>
        <div className="flex gap-8 justify-center flex-wrap">
          <Link to="/posts">
            <Button>View Posts</Button>
          </Link>
          {!isAuthenticated && (
            <>
              <Link to="/login">
                <Button variant="secondary">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary">Register</Button>
              </Link>
            </>
          )}
          {isAuthenticated && (
            <Link to="/new-post">
              <Button variant="secondary">Create a Post</Button>
            </Link>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Home;
