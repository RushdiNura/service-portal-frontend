import { useState, useEffect } from 'react';
import { Users, Briefcase, Shield, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const SuperDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuperStats();
  }, []);

  const fetchSuperStats = async () => {
    try {
      const { data } = await api.get('/super-admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching super stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="card bg-gradient-to-r from-purple-600 to-indigo-800 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Super Admin Panel</h1>
        </div>
        <p className="text-purple-100">Full system control and monitoring</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">+{stats?.users?.newThisWeek || 0} this week</p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold">{stats?.services?.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold">{stats?.users?.admins || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm text-gray-600">Uptime</p>
              <p className="text-2xl font-bold">{Math.floor(stats?.systemHealth?.uptime / 60) || 0}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/admin/create-admin"
            className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors flex items-center gap-3"
          >
            <Shield className="h-6 w-6 text-purple-600" />
            <span className="font-medium">Create Admin</span>
          </Link>
          <Link
            to="/admin/system-stats"
            className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-3"
          >
            <TrendingUp className="h-6 w-6 text-blue-600" />
            <span className="font-medium">System Statistics</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuperDashboard;