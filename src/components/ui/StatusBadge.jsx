const STATUS_MAP = {
  pending: { label: "Pending", dot: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50" },
  "in-progress": { label: "In progress", dot: "bg-brand-500", text: "text-brand-600", bg: "bg-brand-50" },
  completed: { label: "Completed", dot: "bg-moss-400", text: "text-moss-600", bg: "bg-moss-50" },
};

export default function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${s.bg} ${s.text}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// A slim 3-step rail showing where a service sits in its pipeline.
// This is the app's signature motif — used on cards, tables, and details.
export function StatusRail({ status }) {
  const steps = ["pending", "in-progress", "completed"];
  const activeIdx = steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => (
        <div
          key={step}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i <= activeIdx
              ? step === "completed"
                ? "bg-moss-400"
                : "bg-brand-500"
              : "bg-ink-100"
          }`}
        />
      ))}
    </div>
  );
}
