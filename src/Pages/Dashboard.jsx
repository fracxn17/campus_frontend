import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Calendar, TrendingUp, Award, Bell, Users, MessageCircle, Briefcase } from 'lucide-react';
import { StatCard, ProfileCompletion, AnnouncementCard, QuickAccessCard } from '../Components/DashboardWidgets';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Welcome back, John!</h1>
        <p className="text-gray-600">Here's what's happening in your alumni network</p>
      </div>

      {/* Profile Completion */}
      <div className="mb-8">
        <ProfileCompletion percentage={65} onComplete={() => navigate('/profile')} />
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Network}
          value="127"
          label="Connections"
          trend="+12 this month"
          color="blue"
        />
        <StatCard
          icon={Calendar}
          value="3"
          label="Events Attended"
          trend="This year"
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          value="856"
          label="Profile Views"
          trend="+24% increase"
          color="green"
        />
        <StatCard
          icon={Award}
          value="5"
          label="Achievements"
          trend="Total earned"
          color="orange"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Announcements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl text-gray-900 mb-4">Recent Announcements</h3>
          <div className="space-y-4">
            <AnnouncementCard
              icon={Bell}
              title="Annual Alumni Meet 2026"
              description="Join us for the biggest reunion on June 15, 2026. Register now!"
              date="Posted 2 days ago"
              color="blue"
            />
            <AnnouncementCard
              icon={Award}
              title="Distinguished Alumni Awards"
              description="Nominations are now open for the 2026 Distinguished Alumni Awards."
              date="Posted 1 week ago"
              color="gray"
            />
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gray-900">Upcoming Events</h3>
            <button onClick={() => navigate('/events')} className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <div className="bg-blue-600 text-white rounded-lg p-3 text-center w-16 flex-shrink-0">
                <div className="text-2xl">15</div>
                <div className="text-xs">JUN</div>
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 mb-1">Annual Alumni Meet 2026</h4>
                <p className="text-sm text-gray-600">Main Campus Auditorium</p>
                <p className="text-xs text-gray-500 mt-1">10:00 AM - 5:00 PM</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <div className="bg-purple-600 text-white rounded-lg p-3 text-center w-16 flex-shrink-0">
                <div className="text-2xl">22</div>
                <div className="text-xs">JUN</div>
              </div>
              <div className="flex-1">
                <h4 className="text-gray-900 mb-1">Career Development Workshop</h4>
                <p className="text-sm text-gray-600">Virtual Event</p>
                <p className="text-xs text-gray-500 mt-1">2:00 PM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Opportunities */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl text-gray-900">Latest Job Opportunities</h3>
            <button onClick={() => navigate('/jobs')} className="text-blue-600 hover:text-blue-700 text-sm">
              View All
            </button>
          </div>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <h4 className="text-gray-900 mb-2">Senior Software Engineer</h4>
              <p className="text-sm text-gray-600 mb-2">Google • San Francisco, CA</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Full-time</span>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs rounded-full">Remote</span>
              </div>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 cursor-pointer">
              <h4 className="text-gray-900 mb-2">Product Manager</h4>
              <p className="text-sm text-gray-600 mb-2">Microsoft • Seattle, WA</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">Full-time</span>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">Hybrid</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl text-gray-900 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-4">
            <QuickAccessCard
              icon={Users}
              label="Find Alumni"
              onClick={() => navigate('/directory')}
            />
            <QuickAccessCard
              icon={MessageCircle}
              label="Messages"
              onClick={() => navigate('/messages')}
            />
            <QuickAccessCard
              icon={Calendar}
              label="Events"
              onClick={() => navigate('/events')}
            />
            <QuickAccessCard
              icon={Briefcase}
              label="Job Board"
              onClick={() => navigate('/jobs')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
