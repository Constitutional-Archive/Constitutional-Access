import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';

const FeatureCard = ({ iconSrc, alt, title, description, onClick }) => (
  <motion.article
    className="bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 rounded-2xl shadow-xl p-6 flex flex-col space-y-3 hover:scale-105 transition-transform duration-300"
    whileHover={{ scale: 1.05 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <header className="flex items-center space-x-4">
      <div className="p-3 bg-blue-100 rounded-full shadow-lg transform rotate-3">
        <img src={iconSrc} alt={alt} className="h-10 w-10 object-contain" />
      </div>
      <h2 className="text-xl font-semibold">{title}</h2>
    </header>
    <p className="text-sm text-gray-700">{description}</p>
    <button
      onClick={onClick}
      className="mt-2 self-start text-white text-sm bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md"
    >
      {title === 'Admin Panel' ? 'Go to Admin Panel' : 'Explore Feature'}
    </button>
  </motion.article>
);

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const handleAdminClick = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      loginWithRedirect({
        appState: { returnTo: '/admin' }
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-900 to-black p-6 text-white flex flex-col lg:flex-row items-center justify-between">
      {/* Left Section */}
      <section className="w-full lg:w-1/2 space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold"
        >
          Moloko Tsiri
        </motion.h1>
        <motion.img
          src="/massort- contifind.png"
          alt="Mascot"
          className="w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      </section>

      {/* Right Section - Feature Cards */}
      <section className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FeatureCard
          iconSrc="https://cdn-icons-png.flaticon.com/512/10473/10473447.png"
          alt="Search icon"
          title="Document Search"
          description="Search through constitutional documents with ease."
          onClick={() => navigate('/search')}
        />
        <FeatureCard
          iconSrc="https://img.icons8.com/3d-fluency/94/megaphone.png"
          alt="API icon"
          title="API Access"
          description="Integrate with our powerful document API."
          onClick={() => navigate('/api-docs')}
        />
        <FeatureCard
          iconSrc="https://img.icons8.com/3d-fluency/94/book.png"
          alt="Admin icon"
          title="Admin Panel"
          description="Upload and manage constitutional documents."
          onClick={handleAdminClick}
        />
      </section>
    </main>
  );
};

export default HomePage;
