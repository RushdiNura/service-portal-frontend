export function Field({ label, htmlFor, error, children, hint }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-ink-600 tracking-wide uppercase"
        >
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-xs text-ink-400">{hint}</p>}
      {error && <p className="text-xs text-clay-400 font-medium">{error}</p>}
    </div>
  );
}

export default function Input({ className = "", error, ...props }) {
  return (
    <input
      className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-300 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 ${
        error ? "border-clay-400" : "border-ink-200"
      } ${className}`}
      {...props}
    />
  );
}
