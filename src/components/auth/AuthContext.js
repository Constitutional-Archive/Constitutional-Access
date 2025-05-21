import React, { createContext, useContext, useState } from 'react';

// Create context with default values
const AuthContext = createContext({
  token: null,
  user: null,
  roles: [],
  isLoading: false,
  error: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    user: null,
    roles: [],
    isLoading: false,
    error: null
  });

  const login = async (username, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulating login - replace with your actual auth logic
      const mockToken = 'mock-token';
      const mockRoles = ['admin', 'super_admin'];
      
      setAuthState({
        token: mockToken,
        user: { username },
        roles: mockRoles,
        isLoading: false,
        error: null
      });
      
      return true;
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }));
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      token: null,
      user: null,
      roles: [],
      isLoading: false,
      error: null
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook that throws error if used outside provider
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};