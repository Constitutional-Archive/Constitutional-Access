import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const hasRequiredRole = (userRoles, requiredRoles) => {
  if (userRoles.includes('superadmin')) return true;
  return requiredRoles.some(role => userRoles.includes(role));
};

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const userRoles = user?.['https://constifind-api.com/roles'] || [];

  // Debug: Log roles
  console.log('User roles:', userRoles);

  const isNewUser = userRoles.length === 0 || (userRoles.length === 1 && userRoles.includes('new_user'));
  if (isNewUser) {
    return <Navigate to="/pending-approval" replace />;
  }

  const hasRole = requiredRoles.length === 0 || hasRequiredRole(userRoles, requiredRoles);

  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
