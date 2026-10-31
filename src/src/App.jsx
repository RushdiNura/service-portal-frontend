import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import DashboardShell from "./components/layout/DashboardShell";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/user/UserDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminServices from "./pages/admin/AdminServices";
import AdminUsers from "./pages/admin/AdminUsers";
import SuperAdminAdmins from "./pages/superadmin/SuperAdminAdmins";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to="/app" replace />;
}

function DashboardIndex() {
  const { user } = useAuth();
  if (user?.role === "user") return <UserDashboard />;
  return <AdminOverview />;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
            borderRadius: "10px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <DashboardIndex />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/services"
          element={
            <ProtectedRoute roles={["admin", "super-admin"]}>
              <DashboardShell>
                <AdminServices />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/users"
          element={
            <ProtectedRoute roles={["admin", "super-admin"]}>
              <DashboardShell>
                <AdminUsers />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route
          path="/app/admins"
          element={
            <ProtectedRoute roles={["super-admin"]}>
              <DashboardShell>
                <SuperAdminAdmins />
              </DashboardShell>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
