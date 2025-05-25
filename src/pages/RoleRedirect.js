import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

const RoleRedirect = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();

   if (isLoading) return <section aria-busy="true"><p>Loading...</p></section>;
  if (!isAuthenticated) return <Navigate to="/home" replace />;

  const roles = user?.['https://constifind-api.com/roles'] || [];

  if (roles.includes('super_admin')) return <Navigate to="/super-admin" replace />;
  if (roles.includes('admin')) return <Navigate to="/admin" replace />;
  if (roles.includes('default_user') || roles.length === 0) return <Navigate to="/home" replace />;

  return <Navigate to="/unauthorized" replace />;
};


export default RoleRedirect;
