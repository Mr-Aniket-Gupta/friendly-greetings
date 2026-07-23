import { Clock } from "lucide-react";

const BAR_HEIGHTS = [40, 60, 75, 55, 90, 35, 20];
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function WeekStats() {
  return (
    <div className="grid gap-4">
      {/* Punched in card */}
      <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-600">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground">Punched in at</p>
            <p className="truncate font-semibold">09:02 AM</p>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full w-3/4 rounded-full"
            style={{ background: "var(--gradient-primary)" }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">75% of 9h daily goal</p>
      </div>

      {/* Weekly chart card */}
      <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          This week
        </p>
        <p className="mt-2 text-2xl font-bold sm:text-3xl">38h 12m</p>
        <div className="mt-4 flex h-16 items-end gap-1.5">
          {BAR_HEIGHTS.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md"
              style={{
                height: `${h}%`,
                minHeight: 8,
                background: "var(--gradient-primary)",
                opacity: h < 40 ? 0.35 : 1,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {DAYS.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
