import React, { useState } from 'react';
import { LogOut, Shield, Menu, X, FileText, Lock } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminHeader = () => {
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => logout({ returnTo: window.location.origin });
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Only essential admin navigation items
  const adminNavItems = [
    { 
      name: 'File Upload', 
      path: '/admin', 
      icon: <FileText className="h-5 w-5" />,
      current: location.pathname === '/super-admin'
    },
    { 
      name: 'Admin', 
      path: '/super-admin', 
      icon: <Lock className="h-5 w-5" />,
      current: location.pathname === '/super-admin'
    }
  ];

  return (
    <header className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Branding */}
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-white mr-2" />
            <span className="text-lg font-semibold">Admin</span>
          </div>

          {/* Desktop Navigation - Only shows essential items */}
          <nav className="hidden md:flex items-center space-x-1">
            {adminNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  item.current 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/90 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </button>
            ))}
            
            {/* Simple user sign-out */}
            <button
              onClick={handleSignOut}
              className="ml-4 flex items-center text-sm text-white/90 hover:text-white"
            >
              <LogOut className="h-5 w-5 mr-1" />
              <span>Sign Out</span>
            </button>
          </nav>

          {/* Mobile menu button - Simplified */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white hover:text-white/80 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Simplified */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-800 pb-2">
            <div className="px-2 pt-2 space-y-1">
              {adminNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 rounded-md text-base font-medium ${
                    item.current
                      ? 'bg-white/10 text-white'
                      : 'text-white/90 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </button>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white/90 hover:bg-white/5"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
