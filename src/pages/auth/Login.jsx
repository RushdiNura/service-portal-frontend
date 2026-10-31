import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input, { Field } from "../../components/ui/Input";
import { ArrowRight } from "lucide-react";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(form.email, form.password);
      navigate("/app");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
      toast.error(err.response?.data?.message || "Invalid credentials");
    }
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-white">
      {/* Brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-brand-700 text-white p-12 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-amber-400 flex items-center justify-center">
              <span className="font-display font-bold text-brand-900 text-base">
                S
              </span>
            </div>
            <span className="font-display font-semibold text-lg tracking-tight">
              Service Portal
            </span>
          </div>
        </div>

        <div className="relative z-10 max-w-sm">
          <h1 className="font-display text-3xl font-semibold leading-tight">
            Every request, tracked from open to done.
          </h1>
          <p className="text-brand-100 mt-4 text-sm leading-relaxed">
            One place for your team to raise, assign, and close service requests
            — with a clear line of sight for admins and the people waiting on
            them.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { label: "Pending", tone: "bg-amber-400" },
              { label: "In progress", tone: "bg-white" },
              { label: "Completed", tone: "bg-moss-400" },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-24">
                  {[0, 1, 2].map((step) => (
                    <div
                      key={step}
                      className={`h-1 flex-1 rounded-full ${
                        step <= i ? s.tone : "bg-white/15"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-brand-100 font-medium">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-brand-200">
          Internal tool &middot; Authorized personnel only
        </p>

        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="absolute -left-16 top-1/3 h-56 w-56 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-8">
            <div className="h-8 w-8 rounded-md bg-brand-600 flex items-center justify-center">
              <span className="font-display font-bold text-white text-base">
                S
              </span>
            </div>
            <span className="font-display font-semibold text-lg text-ink-900">
              Service Portal
            </span>
          </div>

          <h2 className="font-display text-2xl font-semibold text-ink-900">
            Sign in
          </h2>
          <p className="text-sm text-ink-400 mt-1.5">
            Enter your credentials to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Field label="Email" htmlFor="email">
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>
            <Field label="Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </Field>

            {error && (
              <p className="text-sm text-clay-400 bg-clay-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <Button
              type="submit"
              loading={loading}
              className="w-full"
              size="md"
            >
              Sign in
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <p className="text-sm text-ink-400 mt-6 text-center">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-brand-600 font-medium hover:text-brand-700 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
