import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LogIn, Mail, Lock } from "lucide-react";
import { getUser, setUser, isFaceRegistered } from "@/lib/auth";
import { FaceRegistrationModal } from "@/components/FaceRegistrationModal";

export function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("rushikesh@workday.app");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [showFace, setShowFace] = useState(false);

  useEffect(() => {
    if (getUser() && isFaceRegistered()) navigate({ to: "/" });
  }, [navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const name =
        email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) || "Employee";
      setUser({ name, email, empId: "EMP-10245" });
      setLoading(false);
      if (!isFaceRegistered()) setShowFace(true);
      else navigate({ to: "/" });
    }, 500);
  }

  return (
    <div className="flex items-center justify-center px-6 py-12 sm:px-10">
      <form onSubmit={submit} className="w-full max-w-sm">
        {/* Mobile logo */}
        <div className="lg:hidden">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl"
            style={{ background: "var(--gradient-hero)" }}
          >
            <span className="text-sm font-bold text-white">W</span>
          </div>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to your dashboard.
        </p>

        <div className="mt-8 space-y-4">
          {/* Email */}
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Email</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none"
                placeholder="you@company.com"
                autoComplete="email"
              />
            </div>
          </label>

          {/* Password */}
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </label>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" /> Remember me
            </label>
            <a href="#" className="font-medium text-teal-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Demo mode — any credentials will sign you in.
        </p>
      </form>

      <FaceRegistrationModal
        open={showFace}
        allowSkip
        onDone={() => {
          setShowFace(false);
          navigate({ to: "/" });
        }}
      />
    </div>
  );
}
