import { ShieldCheck } from "lucide-react";

const features = ["Face-based punch in", "Live team availability", "Real-time payroll & leave"];

export function LoginHero() {
  return (
    <div
      className="relative hidden overflow-hidden p-10 text-white lg:flex lg:flex-col lg:justify-between"
      style={{ background: "var(--gradient-hero)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
          <span className="text-sm font-bold">W</span>
        </div>
        <span className="text-lg font-semibold">Workday</span>
      </div>

      {/* Body */}
      <div>
        <h2 className="text-4xl font-bold leading-tight">Your workday, organized.</h2>
        <p className="mt-3 max-w-sm text-white/85">
          Attendance, leaves, growth and payroll — all in one calm, focused workspace.
        </p>
        <div className="mt-8 grid gap-3">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2 text-sm">
              <div className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              {f}
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white/70">© 2026 Workday</p>

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -top-16 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
    </div>
  );
}
