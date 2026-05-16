import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LayoutDashboard, FileText, LogOut, User } from "lucide-react";

const UserLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">
                My Services
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Link
                to="/user/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
              >
                <LayoutDashboard className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              <Link
                to="/user/services"
                className="flex items-center gap-2 text-gray-600 hover:text-primary-600"
              >
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline">My Services</span>
              </Link>

              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="hidden sm:block text-sm font-medium">
                  {user?.name}
                </span>

                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserLayout;
