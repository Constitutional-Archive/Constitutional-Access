import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, BookOpen, Upload, Menu, X, Code, LogOut, Phone } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
      isActive(path) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  const mobileLinkClass = (path) =>
    `block px-3 py-2 rounded-md text-base font-medium ${
      isActive(path) ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm w-full" aria-label="Main site navigation">
      <header className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between w-full">
        <h1 className="text-xl font-bold text-gray-800">Constitution Archive</h1>

        <ul className="hidden md:flex items-center gap-4">
          <li>
            <Link to="/" className={navLinkClass('/')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Home
            </Link>
          </li>
          <li>
            <Link to="/search" className={navLinkClass('/search')}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Link>
          </li>
          <li>
            <Link to="/api-docs" className={navLinkClass('/api-docs')}>
              <Code className="h-4 w-4 mr-2" />
              API Docs
            </Link>
          </li>
          <li>
            <Link to="/contact" className={navLinkClass('/contact')}>
              <Phone className="h-4 w-4 mr-2" />
              Contact
            </Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/admin" className={navLinkClass('/admin')}>
                  <Upload className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              </li>
              <li>
                <button
                  onClick={() => logout({ returnTo: window.location.origin })}
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <button
                onClick={loginWithRedirect}
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Login
              </button>
            </li>
          )}
        </ul>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-200 focus:outline-none"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {isOpen && (
        <section className="md:hidden px-2 pt-2 pb-3 sm:px-3" aria-label="Mobile navigation">
          <ul className="space-y-1">
            <li>
              <Link to="/" className={mobileLinkClass('/')} onClick={() => setIsOpen(false)}>
                <BookOpen className="h-4 w-4 mr-2 inline" />
                Home
              </Link>
            </li>
            <li>
              <Link to="/contact" className={mobileLinkClass('/contact')} onClick={() => setIsOpen(false)}>
                <Phone className="h-4 w-4 mr-2 inline" />
                Contact
              </Link>
            </li>
            <li>
              <Link to="/search" className={mobileLinkClass('/search')} onClick={() => setIsOpen(false)}>
                <Search className="h-4 w-4 mr-2 inline" />
                Search
              </Link>
            </li>
            <li>
              <Link to="/api-docs" className={mobileLinkClass('/api-docs')} onClick={() => setIsOpen(false)}>
                <Code className="h-4 w-4 mr-2 inline" />
                API Docs
              </Link>
            </li>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/admin" className={mobileLinkClass('/admin')} onClick={() => setIsOpen(false)}>
                    <Upload className="h-4 w-4 mr-2 inline" />
                    Admin
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      logout({ returnTo: window.location.origin });
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    loginWithRedirect();
                  }}
                  className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </section>
      )}
    </nav>
  );
};

export default Navbar;
