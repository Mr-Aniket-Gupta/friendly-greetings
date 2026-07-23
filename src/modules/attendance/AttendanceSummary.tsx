import {
  CalendarDays, Briefcase, CalendarCheck, RefreshCw,
  UserX, Plane, CalendarOff, Clock, Sunset, Hourglass, Activity, Sunrise,
} from "lucide-react";

interface Props {
  totalDays: number;
  workingDays: number;
}

export function AttendanceSummary({ totalDays, workingDays }: Props) {
  const topCards = [
    { icon: CalendarDays, label: "Total Days", val: totalDays, tint: "bg-sky-100 text-sky-600", sub: "This month" },
    { icon: Briefcase, label: "Working Days", val: workingDays, tint: "bg-teal-100 text-teal-600", sub: "Excl. Sundays" },
    { icon: CalendarCheck, label: "Days Worked", val: 18, tint: "bg-emerald-100 text-emerald-600", sub: "Attended" },
    { icon: RefreshCw, label: "Regularizations", val: 2, tint: "bg-orange-100 text-orange-600", sub: "This month" },
  ];

  const summaryCards = [
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

  return (
    <>
      {/* Top 4 metric cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {topCards.map(({ icon: Icon, label, val, tint, sub }) => (
          <div
            key={label}
            className="rounded-2xl bg-card p-5 flex items-center gap-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-none">{val}</p>
              <p className="mt-1 text-sm font-semibold text-foreground leading-tight">{label}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary grid */}
      <section className="mt-8">
        <h2 className="text-lg font-bold sm:text-xl">Summary</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {summaryCards.map(({ icon: Icon, label, val, tint }) => (
            <div
              key={label}
              className="rounded-2xl bg-card p-4 transition hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-xl font-bold">{val}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
