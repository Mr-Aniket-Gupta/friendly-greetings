import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export type DayStatus = "present" | "absent" | "half" | "holiday" | "weekoff" | "future" | "leave";

export function statusOf(d: Date, today: Date): DayStatus {
  if (d > today) return "future";
  const dow = d.getDay();
  if (dow === 0) return "weekoff";
  const day = d.getDate();
  if (day % 17 === 0) return "holiday";
  if (day % 11 === 0) return "absent";
  if (day % 13 === 0) return "leave";
  if (day % 7 === 0) return "half";
  return "present";
}

const STATUS_LABELS: Record<DayStatus, string> = {
  present: "Present", absent: "Absent", half: "Half Day",
  holiday: "Holiday", weekoff: "Weekly Off", future: "Upcoming", leave: "On Leave",
};

const STATUS_BADGE: Record<DayStatus, string> = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-rose-100 text-rose-700",
  half: "bg-orange-100 text-orange-700",
  holiday: "bg-violet-100 text-violet-700",
  weekoff: "bg-muted text-muted-foreground",
  future: "bg-muted text-muted-foreground",
  leave: "bg-blue-100 text-blue-700",
};

const COLOR: Record<DayStatus, string> = {
  present: "bg-emerald-100 text-emerald-700",
  absent: "bg-rose-100 text-rose-700",
  half: "bg-orange-100 text-orange-700",
  holiday: "bg-violet-100 text-violet-700",
  weekoff: "bg-muted text-muted-foreground",
  future: "bg-background text-muted-foreground border border-border",
  leave: "bg-blue-100 text-blue-700",
};

function dayInfo(d: Date, today: Date) {
  const status = statusOf(d, today);
  switch (status) {
    case "present": return { punchIn: "09:02 AM", punchOut: "06:35 PM", hours: "9h 33m", status };
    case "half":    return { punchIn: "09:02 AM", punchOut: "01:30 PM", hours: "4h 28m", status };
    default:        return { punchIn: null, punchOut: null, hours: "—", status };
  }
}

// ── Regularization Modal ──────────────────────────────────────────────────────
const REASONS = ["Forgot to Punch", "System Error", "Work From Home", "Official Travel", "Other"];

function RegularizationModal({ date, onClose, onBack }: { date: Date; onClose: () => void; onBack?: () => void }) {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dateStr = date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) { toast.error("Please select a reason"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Regularization request submitted");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button onClick={onBack ?? onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Close"><X className="h-4 w-4" /></button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur"><RefreshCw className="h-6 w-6" /></div>
          <h2 className="mt-3 text-xl font-bold">Apply Regularization</h2>
          <p className="mt-0.5 text-sm text-white/80">{dateStr}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</label>
            <input readOnly value={dateStr} className="w-full rounded-xl border border-input bg-muted px-3 py-2.5 text-sm text-muted-foreground" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason <span className="text-destructive">*</span></label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select a reason</option>
              {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Additional details…" className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Attachment (optional)</label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-input bg-background px-3 py-2.5 text-sm hover:bg-accent">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{fileName ?? "Click to attach a file"}</span>
              <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onBack ?? onClose} className="flex-1 rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-70" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Day Detail Modal ──────────────────────────────────────────────────────────
function DayDetailModal({ date, today, onClose }: { date: Date; today: Date; onClose: () => void }) {
  const info = dayInfo(date, today);
  const [showReg, setShowReg] = useState(false);

  if (showReg) return <RegularizationModal date={date} onClose={onClose} onBack={() => setShowReg(false)} />;

  const label = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Close"><X className="h-4 w-4" /></button>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/75">Attendance Detail</p>
          <h2 className="mt-1 text-xl font-bold">{label}</h2>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[info.status]}`}>{STATUS_LABELS[info.status]}</span>
        </div>
        <div className="p-6 space-y-3">
          {[
            { label: "Punch In", value: info.punchIn ?? "—" },
            { label: "Punch Out", value: info.punchOut ?? "—" },
            { label: "Total Working Hours", value: info.hours ?? "—" },
            { label: "Status", value: STATUS_LABELS[info.status] },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between rounded-xl bg-accent/50 px-4 py-3">
              <span className="text-sm text-muted-foreground">{label}</span>
              <span className="text-sm font-semibold">{value}</span>
            </div>
          ))}
          {info.status === "absent" ? (
            <button onClick={() => setShowReg(true)} className="mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-90" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              Regularize Attendance
            </button>
          ) : (
            <button onClick={onClose} className="mt-2 w-full rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent">Close</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Calendar ──────────────────────────────────────────────────────────────────
interface Props {
  cursor: Date;
  onCursorChange: (d: Date) => void;
  monthName: string;
}

export function AttendanceCalendar({ cursor, onCursorChange, monthName }: Props) {
  const today = new Date();
  const [dayModal, setDayModal] = useState<Date | null>(null);

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

  return (
    <>
      <div className="rounded-3xl bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Calendar</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => onCursorChange(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"><ChevronLeft className="h-4 w-4" /></button>
            <span className="min-w-[8rem] text-center text-sm font-medium">{monthName}</span>
            <button onClick={() => onCursorChange(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>

        {/* Day labels */}
        <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
          {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => <div key={d}>{d}</div>)}
        </div>

        {/* Grid */}
        <div className="mt-2 grid grid-cols-7 gap-1.5">
          {grid.map((d, i) => {
            if (!d) return <div key={i} />;
            const st = statusOf(d, today);
            const isToday = d.toDateString() === today.toDateString();
            return (
              <button
                key={i}
                onClick={() => setDayModal(d)}
                title={STATUS_LABELS[st]}
                className={`aspect-square rounded-xl text-sm font-medium transition hover:scale-[1.06] hover:shadow-sm ${COLOR[st]} ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {[
            { color: "bg-emerald-400", label: "Present" },
            { color: "bg-rose-400", label: "Absent" },
            { color: "bg-orange-400", label: "Half day" },
            { color: "bg-blue-400", label: "On Leave" },
            { color: "bg-violet-400", label: "Holiday" },
            { color: "bg-muted-foreground/50", label: "Week off" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${color}`} /> {label}
            </div>
          ))}
        </div>
      </div>

      {dayModal && (
        <DayDetailModal date={dayModal} today={today} onClose={() => setDayModal(null)} />
      )}
    </>
  );
}
