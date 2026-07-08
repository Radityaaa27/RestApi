import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      // JWT feedback mechanics: 401 (unauthorized) or 411 as specified in design.md.
      if (status === 401 || status === 411) {
        setError(
          err.response?.data?.message || "Incorrect email or password. Please try again."
        );
      } else {
        setError("Something went wrong. Please try again shortly.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-2">
      <div className="w-full max-w-auth">
        <div className="mb-3 flex flex-col items-center gap-1">
          <span className="text-h1 font-bold text-primary">AppPortal</span>
          <p className="text-body text-secondary">Sign in to continue</p>
        </div>

        <div className="rounded-card bg-surface p-4 shadow-card">
          {error && (
            <div className="mb-3 rounded-card border border-alert-error-border bg-alert-error-bg px-2 py-2 text-body text-alert-error-text">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />

            <Button type="submit" isLoading={isSubmitting} className="mt-1 w-full">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>

        <p className="mt-3 text-center text-body text-secondary">
          Forgot your password?{" "}
          <a href="/forgot-password" className="font-medium text-interactive hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
}
