import { useState } from "react";
import { Pencil, Save, X, Loader2, CalendarClock, History, Users as UsersIcon, CheckCircle2, Award } from "lucide-react";
import { useAuth, setUser } from "@/lib/auth";
import { toast } from "sonner";

export function ProfileHeader() {
  const { user } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editRole, setEditRole] = useState("Product Engineer");
  const [editDept, setEditDept] = useState("Engineering");
  const [loading, setLoading] = useState(false);

  const initials = (user?.name ?? "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();

  const summary = [
    { icon: CalendarClock, label: "Joining Date", val: "12 Jan 2023" },
    { icon: History, label: "Experience", val: "3y 6m" },
    { icon: UsersIcon, label: "Reporting Manager", val: "Anita Sharma" },
    { icon: CheckCircle2, label: "Profile Completion", val: "82%" },
  ];

  async function handleSave() {
    if (!editName.trim()) { toast.error("Name cannot be empty"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUser({ ...(user!), name: editName.trim() });
    setLoading(false);
    setEditMode(false);
    toast.success("Profile updated successfully");
  }

  function handleCancel() {
    setEditName(user?.name ?? "");
    setEditRole("Product Engineer");
    setEditDept("Engineering");
    setEditMode(false);
  }

  return (
    <section className="rounded-3xl bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        {/* Avatar */}
        <div
          className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-bold text-white"
          style={{ background: "var(--gradient-hero)" }}
        >
          {initials}
        </div>

        {/* Info / Edit fields */}
        <div className="min-w-0 flex-1">
          {editMode ? (
            <div className="space-y-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                <input value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full max-w-xs rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</label>
                  <input value={editRole} onChange={(e) => setEditRole(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Department</label>
                  <input value={editDept} onChange={(e) => setEditDept(e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">{user?.name ?? "Employee"}</h2>
              <p className="text-sm text-muted-foreground">{user?.empId} · {editRole} · {editDept}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">Full-time</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">Active</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700">
                  <Award className="h-3 w-3" /> Star Performer
                </span>
              </div>
            </>
          )}
        </div>

        {/* Action buttons */}
        {editMode ? (
          <div className="flex flex-wrap gap-2">
            <button onClick={handleCancel} className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">
              <X className="h-4 w-4" /> Cancel
            </button>
            <button onClick={handleSave} disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Saving…</> : <><Save className="h-4 w-4" />Save</>}
            </button>
          </div>
        ) : (
          <button onClick={() => setEditMode(true)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            <Pencil className="h-4 w-4" /> Edit Profile
          </button>
        )}
      </div>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map(({ icon: Icon, label, val }) => (
          <div key={label} className="rounded-2xl border border-border p-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></div>
            <p className="mt-3 text-sm font-bold">{val}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
