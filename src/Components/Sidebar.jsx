import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageCircle, User, Settings } from 'lucide-react';
import { getUserRole } from '../Utilis/helpers';

const Sidebar = () => {
  const location = useLocation();
  const userRole = getUserRole();

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Alumni Profile' },
    { path: '/directory', icon: Users, label: 'Alumni Directory' },
    { path: '/events', icon: Calendar, label: 'Events' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
  ];

  if (userRole === 'admin') {
    menuItems.push({ path: '/admin', icon: Settings, label: 'Admin Panel' });
  }

  return (
    <aside className="w-64 bg-white min-h-[calc(100vh-64px)] shadow-sm">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${isActive
                      ? 'text-white bg-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
