import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, User, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isDarkMode, toggleDarkMode } = useStore();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`${isDarkMode ? 'dark bg-gray-800' : 'bg-white'} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            JobPortal
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/jobs" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>
              Jobs
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role && (
                  <Link to={`/${user.role}/dashboard`} className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>
                    Dashboard
                  </Link>
                )}

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(prev => !prev)}
                    className={`flex items-center cursor-pointer ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}
                  >
                    <User size={20} className="mr-1" />
                    <span>{user?.name}</span>
                  </button>

                  {dropdownOpen && (
                    <div className={`absolute right-0 z-10 mt-2 w-48 rounded-md shadow-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} ring-1 ring-black ring-opacity-5`}>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full text-left px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                          <LogOut size={16} className="mr-2" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>
                  Login
                </Link>
                <Link to="/register" className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-blue-600`}>
                  Register
                </Link>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
