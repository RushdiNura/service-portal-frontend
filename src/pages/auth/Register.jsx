import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { register } from "../../api/endpoints";
import Button from "../../components/ui/Button";
import Input, { Field } from "../../components/ui/Input";
import { ArrowRight } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);
    setLoading(true);
    try {
      await register(form);
      toast.success("Account created — sign in to continue");
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      const msgs = data?.errors || [data?.message || "Registration failed"];
      setErrors(msgs);
      toast.error(msgs[0]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 p-6">
      <div className="w-full max-w-sm bg-white rounded-xl2 shadow-card border border-ink-100 p-8">
        <div className="flex items-center gap-2 mb-6">
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
          Create your account
        </h2>
        <p className="text-sm text-ink-400 mt-1.5">
          Sign up to raise and track your own service requests.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <Field label="Full name" htmlFor="name">
            <Input
              id="name"
              placeholder="Jordan Bekele"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field
            label="Password"
            htmlFor="password"
            hint="At least 6 characters"
          >
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </Field>

          {errors.length > 0 && (
            <ul className="text-sm text-clay-400 bg-clay-50 rounded-lg px-3 py-2 space-y-0.5">
              {errors.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          )}

          <Button type="submit" loading={loading} className="w-full">
            Create account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-sm text-ink-400 mt-6 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-600 font-medium hover:text-brand-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
