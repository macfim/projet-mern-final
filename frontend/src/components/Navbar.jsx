import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();

  return (
    <nav style={{
      backgroundColor: '#2c3e50',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Home
        </Link>
        <Link to="/posts" style={{ color: 'white', textDecoration: 'none' }}>
          Posts
        </Link>
        <Link to="/analytics" style={{ color: 'white', textDecoration: 'none' }}>
          Analytics
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/new-post" style={{ color: 'white', textDecoration: 'none' }}>
              New Post
            </Link>
            {isAdmin && (
              <>
                <Link to="/tags" style={{ color: 'white', textDecoration: 'none' }}>
                  Tags
                </Link>
                <Link to="/users" style={{ color: 'white', textDecoration: 'none' }}>
                  Users
                </Link>
              </>
            )}
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        {isAuthenticated ? (
          <>
            <Link to="/profile" style={{ 
              color: 'white', 
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span>Profile ({user?.username})</span>
              {isAdmin && (
                <span style={{
                  display: 'inline-block',
                  padding: '2px 8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: '600',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Admin
                </span>
              )}
            </Link>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>
              Login
            </Link>
            <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

