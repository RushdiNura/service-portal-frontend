const ROLE_MAP = {
  user: { label: "User", text: "text-ink-600", bg: "bg-ink-100" },
  admin: { label: "Admin", text: "text-brand-600", bg: "bg-brand-50" },
  "super-admin": { label: "Super Admin", text: "text-clay-400", bg: "bg-clay-50" },
};

export default function RoleBadge({ role }) {
  const r = ROLE_MAP[role] || ROLE_MAP.user;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${r.bg} ${r.text}`}
    >
      {r.label}
    </span>
  );
}
