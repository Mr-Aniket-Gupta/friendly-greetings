import { useState } from "react";
import { AlertCircle, Compass, Plane, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    toast.success("Outdoor duty request submitted");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Close"><X className="h-4 w-4" /></button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur"><Compass className="h-6 w-6" /></div>
          <h2 className="mt-3 text-xl font-bold">Apply Outdoor Duty</h2>
          <p className="mt-0.5 text-sm text-white/80">Request field visit or client travel</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">From</label>
              <input type="time" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">To</label>
              <input type="time" value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Location <span className="text-destructive">*</span></label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Client office, site name…" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Purpose of visit…" className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-70" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Request"}
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
      <div className="w-full max-w-md overflow-y-auto max-h-[90vh] rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30" aria-label="Close"><X className="h-4 w-4" /></button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur"><Plane className="h-6 w-6" /></div>
          <h2 className="mt-3 text-xl font-bold">Apply Leave</h2>
          <p className="mt-0.5 text-sm text-white/80">Submit a leave request</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Leave Type <span className="text-destructive">*</span></label>
            <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
              <option value="">Select leave type</option>
              {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">From Date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">To Date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Reason <span className="text-destructive">*</span></label>
            <input type="text" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Brief reason for leave" className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Remarks</label>
            <textarea value={remarks} onChange={(e) => setRemarks(e.target.value)} rows={3} placeholder="Additional details…" className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-input bg-background py-3 text-sm font-medium hover:bg-accent">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white disabled:opacity-70" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Submitting…</> : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
const LEAVES = [
  { label: "Casual Leave", used: 3, total: 8, tint: "bg-sky-100 text-sky-600" },
  { label: "Medical Emergency", used: 1, total: 6, tint: "bg-rose-100 text-rose-600" },
  { label: "Leave Without Pay", used: 0, total: 10, tint: "bg-amber-100 text-amber-600" },
];

export function AttendanceSidebar() {
  const [activeModal, setActiveModal] = useState<"regularization" | "outdoor" | "leave" | null>(null);

  const quickReq = [
    { icon: AlertCircle, label: "Apply Regularization", tint: "bg-orange-100 text-orange-600", action: () => setActiveModal("regularization") },
    { icon: Compass, label: "Apply Outdoor", tint: "bg-violet-100 text-violet-600", action: () => setActiveModal("outdoor") },
    { icon: Plane, label: "Apply Leave", tint: "bg-teal-100 text-teal-600", action: () => setActiveModal("leave") },
  ];

  return (
    <>
      <div className="grid gap-4">
        {/* Leave Balance */}
        <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-base font-bold">Leave Balance</h3>
          <div className="mt-3 space-y-3">
            {LEAVES.map((l) => (
              <div key={l.label} className="rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{l.label}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${l.tint}`}>{l.total - l.used} left</span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full" style={{ width: `${(l.used / l.total) * 100}%`, background: "var(--gradient-primary)" }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Used {l.used}/{l.total}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Requests */}
        <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h3 className="text-base font-bold">Quick Requests</h3>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {quickReq.map(({ icon: Icon, label, tint, action }) => (
              <button key={label} onClick={action} className="flex flex-col items-center gap-2 rounded-2xl p-3 text-center transition hover:bg-accent hover:-translate-y-0.5">
                <div className={`grid h-11 w-11 place-items-center rounded-full ${tint}`}><Icon className="h-5 w-5" /></div>
                <span className="text-[11px] font-medium leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modals rendered outside the sidebar grid so they overlay properly */}
      {activeModal === "outdoor" && <OutdoorModal onClose={() => setActiveModal(null)} />}
      {activeModal === "leave" && <LeaveModal onClose={() => setActiveModal(null)} />}
    </>
  );
}

// Export the regularization modal so AttendanceCalendar can also use it
export { };
