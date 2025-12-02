import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontSize: '16px',
        color: '#475569'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div style={{ 
        padding: '40px 20px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginBottom: '12px',
          color: '#0f172a'
        }}>
          Access Denied
        </h2>
        <p style={{ 
          fontSize: '16px', 
          color: '#64748b',
          marginBottom: '24px'
        }}>
          This page is reserved for administrators only.
        </p>
        <a 
          href="/"
          style={{
            padding: '10px 20px',
            backgroundColor: '#0f172a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-block'
          }}
        >
          Return to Home
        </a>
      </div>
    );
  }

  return children;
}

export default AdminRoute;

