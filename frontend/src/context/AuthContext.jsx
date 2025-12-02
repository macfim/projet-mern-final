import { createContext, useContext, useState, useEffect } from 'react';
import { api, setTokens, setUser, clearTokens } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if token exists on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      try {
        setUserState(JSON.parse(storedUser));
      } catch (e) {
        // If parsing error, remove invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    const response = await api.post('/auth/register', {
      username,
      email,
      password
    });
    setTokens({ token: response.token });
    setUser(response.user);
    setUserState(response.user);
    return response;
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    setTokens({ token: response.token });
    setUser(response.user);
    setUserState(response.user);
    return response;
  };

  const logout = () => {
    clearTokens();
    localStorage.removeItem('user');
    setUserState(null);
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

