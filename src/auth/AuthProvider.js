import { Auth0Provider } from '@auth0/auth0-react';
import { MockAuthProvider, useAuth0 as useMockAuth0 } from './MockAuthProvider';

export const UniversalAuthProvider = ({ children }) => {
  if (process.env.REACT_APP_USE_MOCK_AUTH === 'true') {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: 'openid profile email read:roles'
      }}
    >
      {children}
    </Auth0Provider>
  );
};

// Re-export the appropriate version
export const useAuth0 = process.env.REACT_APP_USE_MOCK_AUTH === 'true'
  ? useMockAuth0
  : require('@auth0/auth0-react').useAuth0;