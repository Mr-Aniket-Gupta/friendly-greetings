import { createFileRoute } from "@tanstack/react-router";
import {
  Bell,
  QrCode,
  Calendar,
  Plane,
  Compass,
  TrendingUp,
  MapPin,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Users,
  FileText,
  Wallet,
  Award,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workday — Employee Dashboard" },
      { name: "description", content: "Track attendance, leaves, growth and daily activity in one place." },
      { property: "og:title", content: "Workday — Employee Dashboard" },
      { property: "og:description", content: "Your daily workspace: punch in/out, quick actions, announcements." },
    ],
  }),
  component: Index,
});

function Index() {
  const quickActions = [
    { icon: Calendar, label: "Attendance", desc: "Mark & regularize", tint: "bg-sky-100 text-sky-600" },
    { icon: Plane, label: "Leave", desc: "Apply & balance", tint: "bg-violet-100 text-violet-600" },
    { icon: Compass, label: "Outdoor Duty", desc: "Field visits", tint: "bg-orange-100 text-orange-600" },
    { icon: TrendingUp, label: "My Growth", desc: "Goals & reviews", tint: "bg-teal-100 text-teal-600" },
    { icon: Wallet, label: "Payroll", desc: "Payslips & tax", tint: "bg-emerald-100 text-emerald-600" },
    { icon: FileText, label: "Documents", desc: "Letters & policies", tint: "bg-rose-100 text-rose-600" },
    { icon: Users, label: "Team", desc: "Directory & org", tint: "bg-indigo-100 text-indigo-600" },
    { icon: Award, label: "Rewards", desc: "Points & perks", tint: "bg-amber-100 text-amber-600" },
  ];

  const announcements = [
    { tag: "Company", title: "Town Hall — Q3 highlights", time: "Today · 4:00 PM" },
    { tag: "Policy", title: "Updated work-from-home guidelines", time: "Yesterday" },
    { tag: "Culture", title: "Wellness week starts Monday", time: "2 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero header */}
      <header
        className="relative overflow-hidden text-white"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <span className="text-sm font-bold">W</span>
              </div>
              <span className="text-lg font-semibold tracking-tight">Workday</span>
            </div>
            <div className="hidden items-center gap-8 text-sm/6 text-white/85 md:flex">
              <a href="#" className="hover:text-white">Home</a>
              <a href="#" className="hover:text-white">Attendance</a>
              <a href="#" className="hover:text-white">Company</a>
              <a href="#" className="hover:text-white">Profile</a>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur transition hover:bg-white/25">
                <QrCode className="h-4 w-4" />
              </button>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white font-semibold text-teal-700">
                RS
              </div>
            </div>
          </nav>

          <div className="mt-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
              Good Afternoon
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight lg:text-5xl">
              Rushikesh <span className="inline-block">👋</span>
            </h1>
            <p className="mt-2 text-sm text-white/80">Thursday, July 23</p>
          </div>
        </div>
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-16 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-20 lg:px-10">
        {/* Punch card + side stats */}
        <section className="-mt-14 grid gap-6 lg:grid-cols-3">
          <div
            className="rounded-3xl bg-card p-8 lg:col-span-2"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Current Time
                </p>
                <p className="mt-1 text-5xl font-bold text-foreground">12:42 PM</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <span className="h-2 w-2 rounded-full bg-teal-500" /> Live
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Today's working hours
                </p>
                <p className="mt-1 text-3xl font-bold text-foreground">6h 42m</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                <MapPin className="h-3.5 w-3.5" /> Location verified
              </span>
            </div>

            <button
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition hover:opacity-95"
              style={{
                background: "var(--gradient-primary)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <span className="h-2 w-2 rounded-full bg-white" />
              Punch Out
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-100 text-teal-600">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Punched in at</p>
                  <p className="font-semibold text-foreground">06:00 AM</p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full" style={{ background: "var(--gradient-primary)" }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">75% of daily goal (9h)</p>
            </div>
            <div className="rounded-3xl bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                This week
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">38h 12m</p>
              <div className="mt-4 flex items-end gap-1.5">
                {[40, 60, 75, 55, 90, 35, 20].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md"
                    style={{
                      height: `${h}%`,
                      minHeight: 8,
                      background: "var(--gradient-primary)",
                      opacity: h < 40 ? 0.4 : 1,
                    }}
                  />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                {["M","T","W","T","F","S","S"].map((d,i)=>(<span key={i}>{d}</span>))}
              </div>
            </div>
          </div>
        </section>

        {/* Quick actions */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Quick Actions</h2>
            <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-700">
              Customize
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {quickActions.map(({ icon: Icon, label, desc, tint }) => (
              <button
                key={label}
                className="group relative rounded-2xl bg-card p-5 text-left transition hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <ChevronRight className="absolute right-4 top-4 h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-base font-semibold text-foreground">{label}</p>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Announcements */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Announcements</h2>
            <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700">
              See all <ChevronRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {announcements.map((a) => (
              <article
                key={a.title}
                className="rounded-2xl bg-card p-6 transition hover:-translate-y-0.5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  {a.tag}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-foreground">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.time}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row lg:px-10">
          <p>© 2026 Workday. All rights reserved.</p>
          <p>Made with care for hybrid teams.</p>
        </div>
      </footer>
    </div>
  );
}
