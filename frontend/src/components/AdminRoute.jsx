import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-5 text-center text-sm text-slate-600">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="py-10 px-5 text-center max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-3 text-slate-900">
          Access Denied
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          This page is reserved for administrators only.
        </p>
        <a
          href="/"
          className="inline-block px-5 py-2 bg-slate-900 text-white no-underline rounded text-sm font-medium hover:bg-slate-800"
        >
          Return to Home
        </a>
      </div>
    );
  }

  return children;
}

export default AdminRoute;
