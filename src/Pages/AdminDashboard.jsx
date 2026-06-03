import { Users, UserPlus, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jan', alumni: 245, events: 12 },
  { month: 'Feb', alumni: 289, events: 15 },
  { month: 'Mar', alumni: 312, events: 18 },
  { month: 'Apr', alumni: 356, events: 14 },
  { month: 'May', alumni: 398, events: 20 },
  { month: 'Jun', alumni: 425, events: 22 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const recentUsers = [
  { id: 1, name: 'Jay Prakash Sharma', email: 'jay.prakash@email.com', batch: '2021', status: 'Active' },
  { id: 2, name: 'Michael Chen', email: 'michael.c@email.com', batch: '2018', status: 'Active' },
  { id: 3, name: 'Priya Patel', email: 'priya.p@email.com', batch: '2017', status: 'Pending' },
];

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your alumni network and platform activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl text-gray-900 mb-1">15,243</div>
          <div className="text-gray-600">Total Alumni</div>
          <div className="text-sm text-green-600 mt-2">+12% from last month</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-green-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl text-gray-900 mb-1">8,567</div>
          <div className="text-gray-600">Active Members</div>
          <div className="text-sm text-green-600 mt-2">+8% from last month</div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="text-3xl text-gray-900 mb-1">254</div>
          <div className="text-gray-600">Events Conducted</div>
          <div className="text-sm text-green-600 mt-2">+15% from last year</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
        <h2 className="text-xl text-gray-900 mb-4">Monthly Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="alumni" fill="#3B82F6" />
            <Bar dataKey="events" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl text-gray-900 mb-4">Recent Registrations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-gray-900">Name</th>
                <th className="text-left py-3 px-4 text-gray-900">Email</th>
                <th className="text-left py-3 px-4 text-gray-900">Batch</th>
                <th className="text-left py-3 px-4 text-gray-900">Status</th>
                <th className="text-left py-3 px-4 text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map(user => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 text-gray-600">{user.batch}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
