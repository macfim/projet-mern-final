import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ 
        fontSize: '36px', 
        fontWeight: 'bold',
        marginBottom: '16px',
        color: '#0f172a'
      }}>
        Welcome
      </h1>
      <p style={{ 
        fontSize: '18px', 
        color: '#64748b', 
        marginBottom: '40px',
        lineHeight: '1.6'
      }}>
        Welcome to our content sharing platform
      </p>
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link
          to="/posts"
          style={{
            padding: '12px 24px',
            backgroundColor: '#0f172a',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          View Posts
        </Link>
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Login
            </Link>
            <Link
              to="/register"
              style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#0f172a',
                textDecoration: 'none',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              Register
            </Link>
          </>
        )}
        {isAuthenticated && (
          <Link
            to="/new-post"
            style={{
              padding: '12px 24px',
              backgroundColor: 'white',
              color: '#0f172a',
              textDecoration: 'none',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Create a Post
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;

