import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Login = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow" aria-labelledby="login-title">
      <header>
        <h2 id="login-title" className="text-2xl font-bold mb-6">Login</h2>
      </header>
      <button
        onClick={() => loginWithRedirect()}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Log in
      </button>
    </section>
  );
};

export default Login;
