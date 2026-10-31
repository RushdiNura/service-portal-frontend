import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAdminStats } from "../../api/endpoints";
import { StatTile, Spinner } from "../../components/ui/Misc";
import { useAuth } from "../../context/AuthContext";

export default function AdminOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getAdminStats()
      .then(({ data }) => setStats(data))
      .catch(() => toast.error("Couldn't load stats"));
  }, []);

  const isSuper = user?.role === "super-admin";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink-900">
          Overview
        </h1>
        <p className="text-sm text-ink-400 mt-1">
          {isSuper
            ? "A snapshot of every user and admin in the system."
            : "A snapshot of the users and services you manage."}
        </p>
      </div>

      {!stats && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}

      {stats && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile label="Total users" value={stats.totalUsers} tone="brand" />
          <StatTile label="Active users" value={stats.activeUsers} tone="moss" />
          {isSuper && (
            <StatTile label="Admins" value={stats.admins} tone="amber" />
          )}
          <StatTile
            label={isSuper ? "Regular users" : "Your users"}
            value={stats.regularUsers}
            tone="ink"
          />
        </div>
      )}
    </div>
  );
}
