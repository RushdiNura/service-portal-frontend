import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import UserLayout from "./layouts/UserLayout";

// Pages
import Login from "./pages/Login";

// Admin & Super Admin Shared Pages
import Users from "./pages/admin/Users";
import Services from "./pages/admin/Services";
import Search from "./pages/admin/Search";

// Admin Dashboard
import AdminDashboard from "./pages/admin/Dashboard";

// Super Admin Dashboard
import SuperDashboard from "./pages/super-admin/SuperDashboard";
import CreateAdmin from "./pages/super-admin/CreateAdmin";
import SystemStats from "./pages/super-admin/SystemStats";

// User Pages
import UserDashboard from "./pages/user/Dashboard";
import UserServices from "./pages/user/Services";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* ============================================ */}
      {/* SUPER ADMIN ROUTES - /super-admin/* */}
      {/* ============================================ */}
      <Route
        path="/super-admin"
        element={
          <ProtectedRoute roles={["super-admin"]}>
            <SuperAdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SuperDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="services" element={<Services />} />
        <Route path="search" element={<Search />} />
        <Route path="create-admin" element={<CreateAdmin />} />
        <Route path="system-stats" element={<SystemStats />} />
      </Route>

      {/* ============================================ */}
      {/* ADMIN ROUTES - /admin/* */}
      {/* ============================================ */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="services" element={<Services />} />
        <Route path="search" element={<Search />} />
      </Route>

      {/* ============================================ */}
      {/* USER ROUTES - /user/* */}
      {/* ============================================ */}
      <Route
        path="/user"
        element={
          <ProtectedRoute roles={["user"]}>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="services" element={<UserServices />} />
      </Route>

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;