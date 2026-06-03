import React from 'react';
import { TrendingUp, Users, Calendar, Briefcase, Network, Award } from 'lucide-react';

export const StatCard = ({ icon: Icon, value, label, trend, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && <TrendingUp className="w-5 h-5 text-green-500" />}
      </div>
      <div className="text-3xl text-gray-900 mb-1">{value}</div>
      <div className="text-gray-600">{label}</div>
      {trend && <div className="text-sm text-green-600 mt-2">{trend}</div>}
    </div>
  );
};

export const ProfileCompletion = ({ percentage, onComplete }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl mb-2">Complete Your Profile</h3>
          <p className="text-blue-100">Add more details to increase your visibility</p>
        </div>
        <button
          onClick={onComplete}
          className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100"
        >
          Complete Profile
        </button>
      </div>
      <div className="w-full bg-blue-800 rounded-full h-2">
        <div
          className="bg-white h-2 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-sm mt-2 text-blue-100">{percentage}% Complete</p>
    </div>
  );
};

export const AnnouncementCard = ({ icon: Icon, title, description, date, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-100',
    gray: 'bg-gray-50 border-gray-100',
  };

  const iconColorClasses = {
    blue: 'bg-blue-600',
    gray: 'bg-gray-600',
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${iconColorClasses[color]} rounded-full flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 mb-2">{description}</p>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
    </div>
  );
};

export const QuickAccessCard = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 text-center transition-all"
    >
      <Icon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
      <p className="text-sm text-gray-900">{label}</p>
    </button>
  );
};

const DashboardWidgets = {
  StatCard,
  ProfileCompletion,
  AnnouncementCard,
  QuickAccessCard,
};

export default DashboardWidgets;
