import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { API_BASE_URL } from '../config/api';

const monthlyData = [
  { month: 'Jan', alumni: 245, events: 12 },
  { month: 'Feb', alumni: 289, events: 15 },
  { month: 'Mar', alumni: 312, events: 18 },
  { month: 'Apr', alumni: 356, events: 14 },
  { month: 'May', alumni: 398, events: 20 },
  { month: 'Jun', alumni: 425, events: 22 },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAlumni: 0,
    activeMembers: 0,
    eventsConducted: 5,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`);
      const data = await response.json();
      if (data.success) {
        setStats({
          totalAlumni: data.totalAlumni,
          activeMembers: data.activeMembers,
          eventsConducted: data.eventsConducted,
        });
      }
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users`);
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchStats(), fetchUsers()]).finally(() => setLoading(false));
  }, []);

  const handleEditRole = async (userId, currentRole) => {
    const newRole = prompt("Enter new role for user (student, alumni, admin):", currentRole);
    if (!newRole) return;
    
    const sanitizedRole = newRole.trim().toLowerCase();
    if (!['student', 'alumni', 'admin'].includes(sanitizedRole)) {
      alert("Invalid role. Please enter 'student', 'alumni', or 'admin'.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: sanitizedRole }),
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchUsers();
        fetchStats();
      } else {
        alert(data.message || 'Failed to update user role');
      }
    } catch (err) {
      alert('Error connecting to the server');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!confirm(`Are you sure you want to permanently delete user "${name}"?`)) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        alert(data.message);
        fetchUsers();
        fetchStats();
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      alert('Error connecting to the server');
    }
  };

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
          <div className="text-3xl text-gray-900 mb-1">{stats.totalAlumni}</div>
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
          <div className="text-3xl text-gray-900 mb-1">{stats.activeMembers}</div>
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
          <div className="text-3xl text-gray-900 mb-1">{stats.eventsConducted}</div>
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
        <h2 className="text-xl text-gray-900 mb-4">User Registrations & Directory Control</h2>
        {loading ? (
          <div className="text-center py-4 text-gray-500">Loading registrations...</div>
        ) : users.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No registered users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 text-gray-900">Batch</th>
                  <th className="text-left py-3 px-4 text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{user.name}</td>
                    <td className="py-3 px-4 text-gray-600">{user.email}</td>
                    <td className="py-3 px-4 text-gray-600">{user.batch || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                        user.role === 'admin'
                          ? 'bg-red-100 text-red-600'
                          : user.role === 'alumni'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleEditRole(user.id, user.role)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                        title="Change User Role"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="text-red-600 hover:text-red-700"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
