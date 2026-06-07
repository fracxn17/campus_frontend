import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Calendar, MessageCircle, User, Settings } from 'lucide-react';
import { getUserRole } from '../Utilis/helpers';

const Sidebar = () => {
  const location = useLocation();
  const userRole = getUserRole();

  const standardItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Alumni Profile' },
    { path: '/messages', icon: MessageCircle, label: 'Messages' },
  ];

  if (userRole === 'admin') {
    standardItems.push({ path: '/admin', icon: Settings, label: 'Admin Panel' });
  }

  const postcardItems = [
    { 
      path: '/directory', 
      icon: Users, 
      label: 'Alumni Directory', 
      description: 'Connect with alumni globally',
      bgClass: 'bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 dark:border-blue-500/30 hover:border-blue-500 hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20',
      activeBgClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent shadow-lg shadow-blue-500/25',
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      activeIconBg: 'bg-white/20 text-white'
    },
    { 
      path: '/events', 
      icon: Calendar, 
      label: 'Events & Reunions', 
      description: 'Join meets, reunions & workshops',
      bgClass: 'bg-gradient-to-br from-orange-500/10 via-pink-500/5 to-transparent border border-orange-500/20 dark:border-orange-500/30 hover:border-orange-500 hover:shadow-orange-500/10 dark:hover:shadow-orange-500/20',
      activeBgClass: 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-lg shadow-orange-500/25',
      iconBg: 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
      activeIconBg: 'bg-white/20 text-white'
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0f1620] min-h-[calc(100vh-64px)] shadow-sm border-r border-gray-100 dark:border-gray-800 flex flex-col justify-between p-4 transition-colors duration-300">
      <div className="space-y-6">
        {/* Standard Menu Items */}
        <nav>
          <ul className="space-y-1">
            {standardItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                        ? 'text-white bg-blue-600 shadow-md shadow-blue-500/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Postcard Items Section */}
        <div className="space-y-4">
          <div className="px-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Discover</span>
          </div>
          
          <div className="space-y-3">
            {postcardItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer ${
                    isActive ? item.activeBgClass : item.bgClass
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isActive ? item.activeIconBg : item.iconBg
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                        {item.label}
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed ${isActive ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-[10px] text-gray-400 dark:text-gray-500 font-medium">
        CampusLegacy v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
