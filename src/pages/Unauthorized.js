import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const Unauthorized = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <section className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow" aria-labelledby="unauth-title">
      <header>
        <h2 id="unauth-title" className="text-2xl font-bold mb-4">Unauthorized Access</h2>
      </header>
      <p className="mb-4">
        You don't have permission to access this page.
      </p>
      <nav>
        <Link
          to={from}
          className="text-blue-500 hover:underline"
        >
          Go back
        </Link>
      </nav>
    </section>
  );
};

export default Unauthorized;
