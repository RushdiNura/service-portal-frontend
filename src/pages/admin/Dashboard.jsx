import { useState, useEffect } from 'react';
import { getStats } from '../../api/admin';
import { Users, Briefcase, TrendingUp, Activity, ArrowRight, UserPlus, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/5 rounded-full translate-y-1/2"></div>
        
        <div className="relative z-10">
          <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-3xl font-bold mt-2">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-400 mt-3 max-w-md">
            Here's what's happening with your service portal today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Total Users</p>
        </div>

        <div className="card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <Activity className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Active Users</p>
        </div>

        <div className="card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-purple-50 rounded-xl">
              <Briefcase className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.admins || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Admins</p>
        </div>

        <div className="card-hover p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.regularUsers || 0}</p>
          <p className="text-sm text-gray-500 mt-1">Regular Users</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link to="/admin/users" className="card-hover p-5 flex items-center gap-4 group">
          <div className="p-3 bg-gray-900 rounded-xl">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Manage Users</p>
            <p className="text-sm text-gray-500">Add, edit, or remove users</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link to="/admin/services" className="card-hover p-5 flex items-center gap-4 group">
          <div className="p-3 bg-gray-900 rounded-xl">
            <FolderPlus className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Manage Services</p>
            <p className="text-sm text-gray-500">Create and track services</p>
          </div>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;