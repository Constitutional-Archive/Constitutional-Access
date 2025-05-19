import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { MockAuthProvider } from './MockAuthProvider';

export const UniversalAuthProvider = ({ children }) => {
  // Check if we're using mock auth (local development)
  if (process.env.REACT_APP_USE_MOCK_AUTH === 'true') {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  // Otherwise use real Auth0
  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: 'openid profile email read:roles'
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};