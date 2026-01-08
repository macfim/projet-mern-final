import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 mb-16">
      <Card>
        <h2 className="mb-6 text-2xl font-bold text-slate-900 text-center">
          Login
        </h2>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2">
              Demo Accounts:
            </p>
            <p className="text-xs text-slate-600">
              <span className="font-medium">Admin:</span> admin@example.com /
              password123
            </p>
            <p className="text-xs text-slate-600">
              <span className="font-medium">User:</span> john@example.com /
              password123
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-slate-900 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default Login;
