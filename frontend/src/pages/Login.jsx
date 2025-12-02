import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
    <div
      style={{
        maxWidth: "440px",
        margin: "60px auto",
        padding: "32px",
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
      }}
    >
      <h2
        style={{
          marginBottom: "24px",
          fontSize: "28px",
          fontWeight: "bold",
          color: "#0f172a",
          textAlign: "center",
        }}
      >
        Login
      </h2>

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "16px",
            backgroundColor: "#fef2f2",
            color: "#991b1b",
            borderRadius: "6px",
            border: "1px solid #fecaca",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#334155",
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: "block",
              marginBottom: "4px",
              fontSize: "14px",
              fontWeight: "500",
              color: "#334155",
            }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              fontSize: "14px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#0f172a",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            fontWeight: "500",
            marginTop: "8px",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p
        style={{
          marginTop: "20px",
          textAlign: "center",
          fontSize: "14px",
          color: "#64748b",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#0f172a",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          Register
        </Link>
      </p>
    </div>
  );
}

export default Login;
