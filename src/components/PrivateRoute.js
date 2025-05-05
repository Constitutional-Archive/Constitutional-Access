import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

// Helper to handle role inheritance
const hasRequiredRole = (userRoles, requiredRoles) => {
  if (userRoles.includes('superadmin')) return true;
  return requiredRoles.some(role => userRoles.includes(role));
};

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" />;

  // Get roles from token using your Auth0 custom namespace
  const rolesNamespace = process.env.ROLES_NAMESPACE || 'https://constifind-api.com/roles';

// Safely get roles from the user object
  const userRoles = user?.[rolesNamespace] || [];

  // Debug: log current roles
  console.log('User roles:', userRoles);

  const hasRole = requiredRoles.length === 0 || hasRequiredRole(userRoles, requiredRoles);

  if (!hasRole) {
    console.log('Access denied. Required roles:', requiredRoles);
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
