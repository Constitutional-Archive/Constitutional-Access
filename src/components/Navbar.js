import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Upload, Menu, X, Code, LogOut, Phone } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const linkClasses = (path) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  const mobileLinkClasses = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      location.pathname === path
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm w-full">
      <header className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between mx-auto w-full">
        <h1 className="text-xl font-bold text-gray-800">Constitution Archive</h1>

        <div className="hidden md:flex items-center space-x-4">
          <Link to="/" className={linkClasses('/')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Home
          </Link>
          <Link to="/search" className={linkClasses('/search')}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Link>
          <Link to="/api-docs" className={linkClasses('/api-docs')}>
            <Code className="h-4 w-4 mr-2" />
            API Docs
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/admin" className={linkClasses('/admin')}>
                <Upload className="h-4 w-4 mr-2" />
                Admin
              </Link>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </button>
          )}
          <Link to="/contact" className={linkClasses('/contact')}>
            <Phone className="h-4 w-4 mr-2" />
          </Link>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {isOpen && (
        <nav className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className={mobileLinkClasses('/')} onClick={() => setIsOpen(false)}>
            <p className="flex items-center">
              <BookOpen className="h-4 w-4 mr-2" /> Home
            </p>
          </Link>
          <Link to="/contact" className={mobileLinkClasses('/contact')} onClick={() => setIsOpen(false)}>
            <p className="flex items-center">
              <Phone className="h-4 w-4 mr-2" /> Contact
            </p>
          </Link>
          <Link to="/search" className={mobileLinkClasses('/search')} onClick={() => setIsOpen(false)}>
            <p className="flex items-center">
              <Search className="h-4 w-4 mr-2" /> Search
            </p>
          </Link>
          <Link to="/api-docs" className={mobileLinkClasses('/api-docs')} onClick={() => setIsOpen(false)}>
            <p className="flex items-center">
              <Code className="h-4 w-4 mr-2" /> API Docs
            </p>
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/admin" className={mobileLinkClasses('/admin')} onClick={() => setIsOpen(false)}>
                <p className="flex items-center">
                  <Upload className="h-4 w-4 mr-2" /> Admin
                </p>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout({ returnTo: window.location.origin });
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700 mt-2"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsOpen(false);
                loginWithRedirect();
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </nav>
      )}
    </nav>
  );
};

export default Navbar;
