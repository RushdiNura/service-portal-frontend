import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { PublicIdBadge } from "../ui/Misc";
import RoleBadge from "../ui/RoleBadge";

const NAV_BY_ROLE = {
  user: [{ to: "/app", label: "My services", icon: ClipboardList, end: true }],
  admin: [
    { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/app/services", label: "Services", icon: ClipboardList },
    { to: "/app/users", label: "Users", icon: Users },
  ],
  "super-admin": [
    { to: "/app", label: "Overview", icon: LayoutGrid, end: true },
    { to: "/app/services", label: "Services", icon: ClipboardList },
    { to: "/app/users", label: "Users", icon: Users },
    { to: "/app/admins", label: "Admins", icon: ShieldCheck },
  ],
};

export default function DashboardShell({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = NAV_BY_ROLE[user?.role] || NAV_BY_ROLE.user;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex bg-ink-50">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 h-14 bg-brand-700 flex items-center justify-between px-4">
        <span className="font-display font-semibold text-white text-sm">
          Service Portal
        </span>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-white">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-30 top-14 md:top-0 bottom-0 w-64 bg-brand-700 text-white flex flex-col transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden md:flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <div className="h-7 w-7 rounded-md bg-amber-400 flex items-center justify-center">
            <span className="font-display font-bold text-brand-900 text-sm">S</span>
          </div>
          <span className="font-display font-semibold tracking-tight">
            Service Portal
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-brand-100 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 pt-3 border-t border-white/10">
          <div className="px-3 py-2 mb-1">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <RoleBadge role={user?.role} />
            </div>
            {user?.publicId && (
              <div className="mt-1.5">
                <PublicIdBadge id={user.publicId} />
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-100 hover:bg-white/5 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden top-14"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
