import { useState, useEffect } from "react";
import api from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  Users,
  Briefcase,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const SystemStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/super-admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  const pieData = [
    { name: "Pending", value: stats?.services?.pending || 0 },
    { name: "In Progress", value: stats?.services?.inProgress || 0 },
    { name: "Completed", value: stats?.services?.completed || 0 },
  ];

  const roleData = [
    { name: "Super Admins", value: stats?.users?.superAdmins || 0 },
    { name: "Admins", value: stats?.users?.admins || 0 },
    { name: "Users", value: stats?.users?.regularUsers || 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">System Statistics</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            +{stats?.users?.newThisWeek || 0} this week
          </p>
        </div>

        <div className="card">
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold">
                {stats?.services?.total || 0}
              </p>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">
            +{stats?.services?.newThisWeek || 0} this week
          </p>
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
              <p className="text-2xl font-bold">
                {Math.floor(stats?.systemHealth?.uptime / 60) || 0}m
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Status: {stats?.systemHealth?.status || "Unknown"}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Users */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Top Users by Services</h2>
          {stats?.topUsers?.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topUsers}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="serviceCount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No data yet</p>
          )}
        </div>

        {/* Service Status Distribution */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4">Service Status</h2>
          {pieData.some((d) => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center text-gray-500 py-12">No services yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemStats;
