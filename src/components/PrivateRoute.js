import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const hasRequiredRole = (userRoles, requiredRoles) => {
  // Always allow super_admins
  if (userRoles.includes('super_admin')) return true;

  for (let i = 0; i < requiredRoles.length; i++) {
    const required = requiredRoles[i];
    for (let j = 0; j < userRoles.length; j++) {
      const role = userRoles[j];
      if (role === required) {
        console.log(`User has required role: ${role}`);
        return true;
      }
    }
  }
  return false;
};

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const userRoles = user?.['https://constifind-api.com/roles'] || [];

  // Debug: Log roles
  console.log('User roles:', userRoles);

  const isNewUser = userRoles.length === 0 || (userRoles.length === 1 && userRoles.includes('default_user'));
  if (isNewUser) {
    return <Navigate to="/pending-approval" replace />;
  }

  console.log('Required roles:', requiredRoles);

  const hasRole = hasRequiredRole(userRoles, requiredRoles);


  if (!hasRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;
