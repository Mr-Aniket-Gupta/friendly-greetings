import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Compass,
  ShieldCheck,
  CalendarOff,
  Hourglass,
  Clock,
  Sunrise,
  Sunset,
  Activity,
  Briefcase,
  Plane,
  UserX,
  CalendarDays,
  CalendarCheck,
  RefreshCw,
  X,
  Loader2,
  Paperclip,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { toast } from "sonner";

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
  component: () => (
    <RequireAuth>
      <AttendancePage />
    </RequireAuth>
  ),
});

type DayStatus = "present" | "absent" | "half" | "holiday" | "weekoff" | "future" | "leave";

function statusOf(d: Date, today: Date): DayStatus {
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

type DayInfo = {
  punchIn: string | null;
  punchOut: string | null;
  hours: string | null;
  status: DayStatus;
};

function dayInfo(d: Date, today: Date): DayInfo {
  const status = statusOf(d, today);
  switch (status) {
    case "present":
      return { punchIn: "09:02 AM", punchOut: "06:35 PM", hours: "9h 33m", status };
    case "half":
      return { punchIn: "09:02 AM", punchOut: "01:30 PM", hours: "4h 28m", status };
    case "absent":
      return { punchIn: null, punchOut: null, hours: "0h 00m", status };
    case "leave":
      return { punchIn: null, punchOut: null, hours: "—", status };
    case "holiday":
      return { punchIn: null, punchOut: null, hours: "—", status };
    case "weekoff":
      return { punchIn: null, punchOut: null, hours: "—", status };
    case "future":
      return { punchIn: null, punchOut: null, hours: "—", status };
  }
}

const STATUS_LABELS: Record<DayStatus, string> = {
  present: "Present",
  absent: "Absent",
  half: "Half Day",
  holiday: "Holiday",
  weekoff: "Weekly Off",
  future: "Upcoming",
  leave: "On Leave",
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

// ── Day Detail Modal ──────────────────────────────────────────────────────────

function DayDetailModal({
  date,
  today,
  onClose,
}: {
  date: Date;
  today: Date;
  onClose: () => void;
}) {
  const info = dayInfo(date, today);
  const [regularizeOpen, setRegularizeOpen] = useState(false);

  const label = date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (regularizeOpen) {
    return (
      <RegularizationModal
        date={date}
        onClose={() => {
          setRegularizeOpen(false);
          onClose();
        }}
        onBack={() => setRegularizeOpen(false)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        {/* Header */}
        <div
          className="relative px-6 py-6 text-white"
          style={{ background: "var(--gradient-hero)" }}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/75">
            Attendance Detail
          </p>
          <h2 className="mt-1 text-xl font-bold">{label}</h2>
          <span
            className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[info.status]}`}
          >
            {STATUS_LABELS[info.status]}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          <Row label="Punch In" value={info.punchIn ?? "—"} />
          <Row label="Punch Out" value={info.punchOut ?? "—"} />
          <Row label="Total Working Hours" value={info.hours ?? "—"} />
          <Row label="Status" value={STATUS_LABELS[info.status]} />

          {info.status === "absent" && (
            <button
              onClick={() => setRegularizeOpen(true)}
              className="mt-2 w-full rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              Regularize Attendance
            </button>
          )}

          {info.status !== "absent" && (
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-accent/50 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}

// ── Regularization Modal ──────────────────────────────────────────────────────

const REGULARIZE_REASONS = [
  "Forgot to Punch",
  "System Error",
  "Work From Home",
  "Official Travel",
  "Other",
];

function RegularizationModal({
  date,
  onClose,
  onBack,
}: {
  date: Date;
  onClose: () => void;
  onBack?: () => void;
}) {
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dateStr = date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) { toast.error("Please select a reason"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Regularization request submitted successfully");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div
          className="relative px-6 py-6 text-white"
          style={{ background: "var(--gradient-hero)" }}
        >
          <button
            onClick={onBack ?? onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <RefreshCw className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-xl font-bold">Apply Regularization</h2>
          <p className="mt-0.5 text-sm text-white/80">{dateStr}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Date
            </label>
            <input
              readOnly
              value={dateStr}
              className="w-full rounded-xl border border-input bg-muted px-3 py-2.5 text-sm text-muted-foreground"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Reason <span className="text-destructive">*</span>
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select a reason</option>
              {REGULARIZE_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              placeholder="Add any additional details…"
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Attachment (optional)
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-input bg-background px-3 py-2.5 text-sm hover:bg-accent">
              <Paperclip className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{fileName ?? "Click to attach a file"}</span>
              <input
                type="file"
                className="hidden"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
              />
            </label>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onBack ?? onClose}
              className="flex-1 rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-70"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Outdoor Modal ─────────────────────────────────────────────────────────────

function OutdoorModal({ onClose }: { onClose: () => void }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [from, setFrom] = useState("09:00");
  const [to, setTo] = useState("18:00");
  const [location, setLocation] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) { toast.error("Please enter a location"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Outdoor duty request submitted successfully");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <Compass className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-xl font-bold">Apply Outdoor Duty</h2>
          <p className="mt-0.5 text-sm text-white/80">Request field visit or client travel</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</label>
              <input type="time" value={from} onChange={(e) => setFrom(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">To</label>
              <input type="time" value={to} onChange={(e) => setTo(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location <span className="text-destructive">*</span></label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Client office, site name, etc."
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Purpose of outdoor visit…"
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-70"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Leave Modal ───────────────────────────────────────────────────────────────

const LEAVE_TYPES = ["Casual Leave", "Medical Emergency", "Leave Without Pay", "Earned Leave", "Compensatory Off"];

function LeaveModal({ onClose }: { onClose: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [leaveType, setLeaveType] = useState("");
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reason, setReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!leaveType) { toast.error("Please select a leave type"); return; }
    if (!reason.trim()) { toast.error("Please enter a reason"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    toast.success("Leave request submitted successfully");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-y-auto max-h-[90vh] overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <Plane className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-xl font-bold">Apply Leave</h2>
          <p className="mt-0.5 text-sm text-white/80">Submit a leave request</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Leave Type <span className="text-destructive">*</span></label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select leave type</option>
              {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)}
                className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason <span className="text-destructive">*</span></label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Brief reason for leave"
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Additional details…"
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-70"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

function AttendancePage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [dayModal, setDayModal] = useState<Date | null>(null);
  const [activeModal, setActiveModal] = useState<"regularization" | "outdoor" | "leave" | null>(null);

  const monthName = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const grid = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const totalDays = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const workingDays = Array.from(
    { length: totalDays },
    (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1),
  ).filter((d) => d.getDay() !== 0).length;

  const topCards = [
    { icon: CalendarDays, label: "Total Days", val: totalDays, tint: "bg-sky-100 text-sky-600", sub: "This month" },
    { icon: Briefcase, label: "Working Days", val: workingDays, tint: "bg-teal-100 text-teal-600", sub: "Excl. Sundays" },
    { icon: CalendarCheck, label: "Days Worked", val: 18, tint: "bg-emerald-100 text-emerald-600", sub: "Attended" },
    { icon: RefreshCw, label: "Total Regularizations", val: 2, tint: "bg-orange-100 text-orange-600", sub: "This month" },
  ];

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
    {
      icon: AlertCircle,
      label: "Apply Regularization",
      tint: "bg-orange-100 text-orange-600",
      action: () => setActiveModal("regularization"),
    },
    {
      icon: Compass,
      label: "Apply Outdoor",
      tint: "bg-violet-100 text-violet-600",
      action: () => setActiveModal("outdoor"),
    },
    {
      icon: Plane,
      label: "Apply Leave",
      tint: "bg-teal-100 text-teal-600",
      action: () => setActiveModal("leave"),
    },
  ];

  const color: Record<DayStatus, string> = {
    present: "bg-emerald-100 text-emerald-700",
    absent: "bg-rose-100 text-rose-700",
    half: "bg-orange-100 text-orange-700",
    holiday: "bg-violet-100 text-violet-700",
    weekoff: "bg-muted text-muted-foreground",
    future: "bg-background text-muted-foreground border border-border",
    leave: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader title={monthName} subtitle="Attendance" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Top Summary Cards */}
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

        {/* Attendance Summary */}
        <section className="mt-8">
          <h2 className="text-lg font-bold sm:text-xl">Summary</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {summary.map(({ icon: Icon, label, val, tint }) => (
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

        {/* Calendar + Sidebar */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Calendar */}
          <div
            className="rounded-3xl bg-card p-5 lg:col-span-2"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Calendar</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="min-w-[8rem] text-center text-sm font-medium">{monthName}</span>
                <button
                  onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                  className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase text-muted-foreground">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {grid.map((d, i) => {
                if (!d) return <div key={i} />;
                const st = statusOf(d, today);
                const isToday = d.toDateString() === today.toDateString();
                return (
                  <button
                    key={i}
                    onClick={() => setDayModal(d)}
                    className={`aspect-square rounded-xl text-sm font-medium transition hover:scale-[1.06] hover:shadow-sm ${color[st]} ${isToday ? "ring-2 ring-primary ring-offset-1" : ""}`}
                    title={STATUS_LABELS[st]}
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
              <Legend color="bg-blue-400" label="On Leave" />
              <Legend color="bg-violet-400" label="Holiday" />
              <Legend color="bg-muted-foreground/50" label="Week off" />
            </div>
          </div>

          {/* Right sidebar */}
          <div className="grid gap-4">
            {/* Leave Balance */}
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Leave Balance</h3>
              <div className="mt-3 space-y-3">
                {leaves.map((l) => (
                  <div key={l.label} className="rounded-2xl border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold">{l.label}</p>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.tint}`}>
                        {l.total - l.used} left
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(l.used / l.total) * 100}%`,
                          background: "var(--gradient-primary)",
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Used {l.used}/{l.total}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Requests */}
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Quick Requests</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {quickReq.map(({ icon: Icon, label, tint, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition hover:bg-accent hover:-translate-y-0.5"
                  >
                    <div className={`grid h-11 w-11 place-items-center rounded-full ${tint}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-medium leading-tight">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {dayModal && (
        <DayDetailModal
          date={dayModal}
          today={today}
          onClose={() => setDayModal(null)}
        />
      )}
      {activeModal === "regularization" && (
        <RegularizationModal
          date={today}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === "outdoor" && (
        <OutdoorModal onClose={() => setActiveModal(null)} />
      )}
      {activeModal === "leave" && (
        <LeaveModal onClose={() => setActiveModal(null)} />
      )}
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
