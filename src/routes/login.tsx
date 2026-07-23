import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogIn, Mail, Lock, ShieldCheck } from "lucide-react";
import { getUser, setUser, isFaceRegistered } from "@/lib/auth";
import { FaceRegistrationModal } from "@/components/FaceRegistrationModal";

export const Route = createFileRoute("/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — Workday" },
      { name: "description", content: "Sign in to your Workday employee dashboard." },
      { property: "og:title", content: "Sign in — Workday" },
      { property: "og:description", content: "Access attendance, leaves and your profile." },
    ],
  }),
  component: Login,
});

function Login() {
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
      const name = email.split("@")[0].replace(/\b\w/g, (c) => c.toUpperCase()) || "Employee";
      setUser({ name, email, empId: "EMP-10245" });
      setLoading(false);
      if (!isFaceRegistered()) setShowFace(true);
      else navigate({ to: "/" });
    }, 500);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid min-h-screen max-w-6xl gap-0 lg:grid-cols-2">
        <div
          className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <span className="text-sm font-bold">W</span>
            </div>
            <span className="text-lg font-semibold">Workday</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold leading-tight">Your workday, organized.</h2>
            <p className="mt-3 max-w-sm text-white/85">Attendance, leaves, growth and payroll — all in one calm, focused workspace.</p>
            <div className="mt-8 grid gap-3">
              {["Face-based punch in", "Live team availability", "Real-time payroll & leave"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm">
                  <div className="grid h-6 w-6 place-items-center rounded-full bg-white/20"><ShieldCheck className="h-3.5 w-3.5" /></div>
                  {f}
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/70">© 2026 Workday</p>
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="flex items-center justify-center px-6 py-12 sm:px-10">
          <form onSubmit={submit} className="w-full max-w-sm">
            <div className="lg:hidden">
              <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "var(--gradient-hero)" }}>
                <span className="text-sm font-bold text-white">W</span>
              </div>
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to continue to your dashboard.</p>

            <div className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Email</span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent py-3 text-sm outline-none"
                    placeholder="you@company.com"
                  />
                </div>
              </label>
              <label className="block">
                <span className="text-xs font-medium text-muted-foreground">Password</span>
                <div className="mt-1 flex items-center gap-2 rounded-xl border border-input bg-background px-3">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent py-3 text-sm outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </label>
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> Remember me</label>
                <a href="#" className="font-medium text-teal-600 hover:underline">Forgot password?</a>
              </div>

              <button
                type="submit" disabled={loading}
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
        </div>
      </div>

      <FaceRegistrationModal
        open={showFace}
        allowSkip
        onDone={() => { setShowFace(false); navigate({ to: "/" }); }}
      />
    </div>
  );
}