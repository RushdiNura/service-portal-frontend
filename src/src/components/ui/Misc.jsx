import { Loader2, Inbox } from "lucide-react";

export function Card({ className = "", children }) {
  return (
    <div
      className={`bg-white rounded-xl2 border border-ink-100 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

export function PublicIdBadge({ id }) {
  return (
    <span className="font-mono text-xs font-medium text-ink-500 bg-ink-100 rounded px-1.5 py-0.5 tracking-tight">
      {id}
    </span>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`animate-spin text-brand-500 ${className}`} />;
}

export function FullPageSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-ink-50">
      <Spinner className="h-7 w-7" />
    </div>
  );
}

export function EmptyState({ title, description, icon: Icon = Inbox, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="h-12 w-12 rounded-full bg-ink-100 flex items-center justify-center mb-4">
        <Icon className="h-5 w-5 text-ink-400" />
      </div>
      <h3 className="font-display font-semibold text-ink-800">{title}</h3>
      {description && (
        <p className="text-sm text-ink-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function StatTile({ label, value, sub, tone = "brand" }) {
  const toneMap = {
    brand: "text-brand-600",
    amber: "text-amber-600",
    moss: "text-moss-600",
    clay: "text-clay-400",
    ink: "text-ink-700",
  };
  return (
    <Card className="p-5">
      <p className="text-xs font-semibold text-ink-400 uppercase tracking-wide">
        {label}
      </p>
      <p className={`font-display text-3xl font-semibold mt-2 ${toneMap[tone]}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-ink-400 mt-1">{sub}</p>}
    </Card>
  );
}
