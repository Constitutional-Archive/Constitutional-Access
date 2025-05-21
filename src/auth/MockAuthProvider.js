import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const MockAuthProvider = ({ children }) => {
  const [user] = useState({ // Removed unused setUser
    name: "Local Admin",
    email: "admin@local.dev",
    'https://localhost/roles': ['admin', 'superadmin']
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const loginWithRedirect = () => {
    setIsAuthenticated(true);
    return Promise.resolve();
  };

  const logout = () => {
    setIsAuthenticated(false);
    return Promise.resolve();
  };

  const getAccessTokenSilently = () => {
    return Promise.resolve("mock-access-token");
  };

  const value = {
    isAuthenticated,
    user,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims: () => Promise.resolve({ __raw: "mock-token" })
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Export named useAuth0 hook
export function useAuth0() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth0 must be used within an AuthProvider');
  }
  return context;
}