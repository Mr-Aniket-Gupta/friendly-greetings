import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { setUser, useAuth } from "@/lib/auth";

const nav = [
  { to: "/", label: "Home" },
  { to: "/attendance", label: "Attendance" },
  { to: "/profile", label: "Profile" },
] as const;

export function AppHeader({
  title,
  subtitle,
  gradient = true,
}: {
  title: string;
  subtitle?: string;
  gradient?: boolean;
}) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const initials = (user?.name ?? "U")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header
      className="relative overflow-hidden text-white mb-[100px]"
      style={gradient ? { background: "var(--gradient-hero)" } : undefined}
    >
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-10">
        <nav className="flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <span className="text-sm font-bold">W</span>
            </div>
            <span className="text-base font-semibold tracking-tight">Workday</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {nav.map((n) => {
              const active = pathname === n.to;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition ${active ? "bg-white text-teal-700 font-semibold" : "text-white/85 hover:bg-white/15"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              aria-label="Notifications"
              className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
            </button>
            <button
              onClick={() => {
                setUser(null);
                navigate({ to: "/login" });
              }}
              aria-label="Sign out"
              className="hidden h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25 sm:grid"
            >
              <LogOut className="h-4 w-4" />
            </button>
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-sm font-semibold text-teal-700">
              {initials}
            </div>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-9 w-9 place-items-center rounded-full bg-white/15 backdrop-blur md:hidden"
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="mt-3 grid gap-1 rounded-2xl bg-white/10 p-2 backdrop-blur md:hidden">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2 text-sm text-white hover:bg-white/15"
              >
                {n.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setUser(null);
                navigate({ to: "/login" });
              }}
              className="rounded-xl px-3 py-2 text-left text-sm text-white hover:bg-white/15"
            >
              Sign out
            </button>
          </div>
        )}

        <div className="pb-5 pt-4 sm:pb-7 sm:pt-5">
          {subtitle && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
              {subtitle}
            </p>
          )}
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
    </header>
  );
}
