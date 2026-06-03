import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, LogOut, Bell, Search, Sun, Moon } from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/login');
      } else if (location.pathname === '/admin' && user.role !== 'admin') {
        navigate('/dashboard');
      }
    }
  }, [user, loading, navigate, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-xl font-semibold text-gray-600 dark:text-gray-300 animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <span className="text-xl text-gray-900">CampusLegacy</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
              </div>
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-all duration-300 animate-pulse"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-6 h-6 text-yellow-500 animate-spin-slow" /> : <Moon className="w-6 h-6" />}
              </button>
              <button className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {/* User avatar */}
              {user && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {getInitials(user.fullName)}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user.fullName}</span>
                </div>
              )}
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
