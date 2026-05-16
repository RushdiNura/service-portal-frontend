import { useState, useEffect } from "react";
import { getMyServices } from "../../api/services";
import { useAuth } from "../../context/AuthContext";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

const UserDashboard = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const data = await getMyServices();
      setServices(data.services);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const pendingCount = services.filter((s) => s.status === "pending").length;
  const inProgressCount = services.filter(
    (s) => s.status === "in-progress",
  ).length;
  const completedCount = services.filter(
    (s) => s.status === "completed",
  ).length;

  const stats = [
    {
      title: "Total Services",
      value: services.length,
      icon: FileText,
      color: "bg-blue-500",
      link: "/user/services",
    },
    {
      title: "In Progress",
      value: inProgressCount,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      title: "Completed",
      value: completedCount,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Pending",
      value: pendingCount,
      icon: AlertCircle,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-primary-100">
          Here's an overview of your services
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Services */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Services</h2>
          <Link
            to="/user/services"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            View All →
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No services yet. Contact your administrator.
          </p>
        ) : (
          <div className="space-y-3">
            {services.slice(0, 5).map((service) => (
              <div
                key={service._id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-medium">{service.serviceName}</h3>
                  <p className="text-sm text-gray-500">{service.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    service.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : service.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {service.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
