import { useState } from 'react';
import { LogOut, Shield, Menu, Mail, X, Lock } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => logout({ returnTo: window.location.origin });
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const adminNavItems = [
    {
      name: 'Admin',
      path: '/super-admin',
      icon: <Lock className="h-5 w-5" />,
      current: location.pathname === '/super-admin'
    },
    {
      name: 'Contact Us',
      path: '/contact',
      icon: <Mail className="h-5 w-5" />,
      current: location.pathname === '/contact'
    }
  ];

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="flex justify-between items-center h-16" aria-label="Main admin navigation">
          {/* Branding */}
          <section className="flex items-center">
            <Shield className="h-6 w-6 text-white me-2" />
            <h1 className="text-lg font-semibold">Admin</h1>
          </section>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Desktop navigation">
            <ul className="flex items-center space-x-1 list-none">
              {adminNavItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      item.current ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <strong className="ms-2">{item.name}</strong>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleSignOut}
                  className="ms-4 flex items-center text-sm text-white/90 hover:text-white"
                >
                  <LogOut className="h-5 w-5 me-1" />
                  <strong>Sign Out</strong>
                </button>
              </li>
            </ul>
          </nav>

          {/* Mobile menu toggle */}
          <section className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-white/80 focus:outline-none"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </section>
        </section>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden bg-indigo-800 pb-2" aria-label="Mobile navigation">
            <ul className="px-2 pt-2 space-y-1 list-none">
              {adminNavItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                      item.current ? 'bg-white/10 text-white' : 'text-white/90 hover:bg-white/5'
                    }`}
                  >
                    {item.icon}
                    <strong className="ms-3">{item.name}</strong>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/5"
                >
                  <LogOut className="h-5 w-5 me-3" />
                  <strong>Sign Out</strong>
                </button>
              </li>
            </ul>
          </nav>
        )}
      </section>
    </header>
  );
};

export default AdminHeader;
