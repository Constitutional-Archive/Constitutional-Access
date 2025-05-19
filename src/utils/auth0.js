import axios from 'axios';

export const getAuth0Token = async (username, password) => {
  try {
    const params = new URLSearchParams();
    params.append('client_id', process.env.REACT_APP_AUTH0_CLIENT_ID);
    params.append('client_secret', process.env.REACT_APP_AUTH0_CLIENT_SECRET);
    params.append('audience', process.env.REACT_APP_AUTH0_AUDIENCE);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'openid profile email read:roles');

    const response = await axios.post(
      `https://${process.env.REACT_APP_AUTH0_DOMAIN}/oauth/token`,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    // Decode token to verify roles
    const payload = JSON.parse(
      Buffer.from(response.data.access_token.split('.')[1], 'base64').toString()
    );
    console.log('Token Payload:', payload);

    return {
      ...response.data,
      decodedToken: payload
    };
  } catch (error) {
    console.error('Auth0 token error:', error.response?.data || error.message);
    throw error;
  }
};