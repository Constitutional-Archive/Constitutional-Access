// src/pages/Unauthorized.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Unauthorized = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
      <p className="mb-4">
        You don't have permission to access this page.
      </p>
      <Link
        to={from}
        className="text-blue-500 hover:underline"
      >
        Go back
      </Link>
    </div>
  );
};

export default Unauthorized;