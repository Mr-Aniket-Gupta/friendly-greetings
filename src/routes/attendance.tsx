import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, MapPin, PlayCircle, PauseCircle, StopCircle,
  AlertCircle, Timer, Coffee, ShieldCheck, Compass,
  UserX, CalendarOff, Hourglass, Clock, Sunrise, Sunset, Activity, Briefcase, Plane,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";

export const Route = createFileRoute("/attendance")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Attendance — Workday" },
      { name: "description", content: "Track punches, leaves and monthly attendance calendar." },
      { property: "og:title", content: "Attendance — Workday" },
      { property: "og:description", content: "Monthly calendar, leave balance and today's activity." },
    ],
  }),
  component: () => (<RequireAuth><AttendancePage /></RequireAuth>),
});

type DayStatus = "present" | "absent" | "half" | "holiday" | "weekoff" | "future";

function statusOf(d: Date, today: Date): DayStatus {
  if (d > today) return "future";
  const dow = d.getDay();
  if (dow === 0) return "weekoff";
  const day = d.getDate();
  if (day % 17 === 0) return "holiday";
  if (day % 11 === 0) return "absent";
  if (day % 7 === 0) return "half";
  return "present";
}

function AttendancePage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(today);

  const monthName = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const totalDays = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const workingDays = Array.from({ length: totalDays }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1))
    .filter((d) => d.getDay() !== 0).length;

  const summary = [
    { icon: UserX, label: "Absents", val: 2, tint: "bg-rose-100 text-rose-600" },
    { icon: Plane, label: "On Leave", val: 1, tint: "bg-violet-100 text-violet-600" },
    { icon: CalendarOff, label: "Half Days", val: 3, tint: "bg-orange-100 text-orange-600" },
    { icon: Clock, label: "Late", val: 4, tint: "bg-amber-100 text-amber-600" },
    { icon: Sunset, label: "Early Out", val: 2, tint: "bg-pink-100 text-pink-600" },
    { icon: Hourglass, label: "Deficit Hrs", val: "3h 20m", tint: "bg-red-100 text-red-600" },
    { icon: Briefcase, label: "Total Hrs", val: "142h", tint: "bg-teal-100 text-teal-600" },
    { icon: Activity, label: "Days Worked", val: 18, tint: "bg-sky-100 text-sky-600" },
    { icon: Sunrise, label: "Avg / day", val: "7h 54m", tint: "bg-emerald-100 text-emerald-600" },
  ];

  const leaves = [
    { label: "Casual Leave", used: 3, total: 8, tint: "bg-sky-100 text-sky-600" },
    { label: "Medical Emergency", used: 1, total: 6, tint: "bg-rose-100 text-rose-600" },
    { label: "Leave Without Pay", used: 0, total: 10, tint: "bg-amber-100 text-amber-600" },
  ];

  const quickReq = [
    { icon: AlertCircle, label: "Regularize", tint: "bg-orange-100 text-orange-600" },
    { icon: Compass, label: "Outdoor", tint: "bg-violet-100 text-violet-600" },
    { icon: Timer, label: "Extra Time", tint: "bg-teal-100 text-teal-600" },
  ];

  const timeline = [
    { icon: PlayCircle, label: "Punch In", time: "09:02 AM", dur: "—", loc: "HQ — 4th Floor", verified: true, tint: "bg-emerald-100 text-emerald-600" },
    { icon: Coffee, label: "Break", time: "01:00 PM", dur: "35m", loc: "Cafeteria", verified: true, tint: "bg-amber-100 text-amber-600" },
    { icon: PauseCircle, label: "Back from Break", time: "01:35 PM", dur: "—", loc: "HQ — 4th Floor", verified: true, tint: "bg-sky-100 text-sky-600" },
    { icon: Activity, label: "Working", time: "Now", dur: "3h 15m", loc: "HQ — 4th Floor", verified: true, tint: "bg-teal-100 text-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader title={monthName} subtitle="Attendance" />

      <main className="mx-auto -mt-8 max-w-7xl px-4 sm:-mt-10 sm:px-6 lg:px-10">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total Days", value: totalDays },
            { label: "Working Days", value: workingDays },
            { label: "Days Worked", value: 18 },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl bg-card p-4" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-bold sm:text-xl">Summary</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {summary.map(({ icon: Icon, label, val, tint }) => (
              <div key={label} className="rounded-2xl bg-card p-4 transition hover:-translate-y-0.5" style={{ boxShadow: "var(--shadow-card)" }}>
                <div className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
                <p className="mt-3 text-xl font-bold">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Calendar</h2>
              <div className="flex items-center gap-1">
                <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"><ChevronLeft className="h-4 w-4" /></button>
                <span className="min-w-[8rem] text-center text-sm font-medium">{monthName}</span>
                <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {grid.map((d, i) => {
                if (!d) return <div key={i} />;
                const st = statusOf(d, today);
                const isToday = d.toDateString() === today.toDateString();
                const isSel = selected?.toDateString() === d.toDateString();
                const color: Record<DayStatus, string> = {
                  present: "bg-emerald-100 text-emerald-700",
                  absent: "bg-rose-100 text-rose-700",
                  half: "bg-orange-100 text-orange-700",
                  holiday: "bg-violet-100 text-violet-700",
                  weekoff: "bg-muted text-muted-foreground",
                  future: "bg-background text-muted-foreground",
                };
                return (
                  <button
                    key={i}
                    onClick={() => setSelected(d)}
                    className={`aspect-square rounded-xl text-sm font-medium transition hover:scale-[1.03] ${color[st]} ${isToday ? "ring-2 ring-primary" : ""} ${isSel && !isToday ? "ring-2 ring-teal-500" : ""}`}
                  >
                    {d.getDate()}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <Legend color="bg-emerald-400" label="Present" />
              <Legend color="bg-rose-400" label="Absent" />
              <Legend color="bg-orange-400" label="Half day" />
              <Legend color="bg-violet-400" label="Holiday" />
              <Legend color="bg-muted-foreground/50" label="Week off" />
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Leave Balance</h3>
              <div className="mt-3 space-y-3">
                {leaves.map((l) => (
                  <div key={l.label} className="rounded-2xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{l.label}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.tint}`}>{l.total - l.used} left</span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${(l.used / l.total) * 100}%`, background: "var(--gradient-primary)" }} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                      <span>Used {l.used}/{l.total}</span>
                      <button className="font-semibold text-teal-600 hover:underline">Apply</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Quick Requests</h3>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {quickReq.map(({ icon: Icon, label, tint }) => (
                  <button key={label} className="flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition hover:bg-accent">
                    <div className={`grid h-12 w-12 place-items-center rounded-full ${tint}`}><Icon className="h-5 w-5" /></div>
                    <span className="text-xs font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Today's Punches</h2>
            <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <StopCircle className="h-4 w-4" /> Punch Out
            </button>
          </div>
          <div className="mt-4 rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
            <ol className="relative space-y-5 border-l-2 border-dashed border-border pl-6">
              {timeline.map((e, i) => {
                const Icon = e.icon;
                return (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[35px] grid h-8 w-8 place-items-center rounded-full ${e.tint}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold">{e.label}</p>
                        <p className="text-xs text-muted-foreground"><MapPin className="mr-1 inline h-3 w-3" />{e.loc}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{e.time}</p>
                        <p className="text-xs text-muted-foreground">{e.dur}</p>
                      </div>
                      {e.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          <ShieldCheck className="h-3 w-3" /> Verified
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </main>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
    </div>
  );
}