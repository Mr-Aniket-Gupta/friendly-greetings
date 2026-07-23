import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User, MapPin, Phone, IdCard, GraduationCap, Users as UsersIcon, Landmark, FileText,
  Sun, Moon, Languages, Bell, Shield, LifeBuoy, LogOut,
  Pencil, CalendarClock, History, ArrowUpRight, Award, CheckCircle2,
  Save, X, Loader2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { setUser, useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Profile — Workday" },
      { name: "description", content: "Your employee profile, documents, settings and activity." },
      { property: "og:title", content: "Profile — Workday" },
      { property: "og:description", content: "Manage personal info, documents and preferences." },
    ],
  }),
  component: () => (<RequireAuth><ProfilePage /></RequireAuth>),
});

// ── Section field definitions ─────────────────────────────────────────────────

type Field = { key: string; label: string; type?: "text" | "textarea" | "email" | "tel"; placeholder?: string };

type Section = {
  id: string;
  icon: any;
  title: string;
  desc: string;
  fields: Field[];
  initialValues: Record<string, string>;
};

const SECTIONS: Section[] = [
  {
    id: "about",
    icon: User,
    title: "About Me",
    desc: "Bio & personal summary",
    fields: [{ key: "bio", label: "Bio", type: "textarea", placeholder: "Write a short bio about yourself…" }],
    initialValues: { bio: "Passionate product engineer with 3+ years of experience building delightful workplace tools." },
  },
  {
    id: "address",
    icon: MapPin,
    title: "Address",
    desc: "Current & permanent",
    fields: [
      { key: "street", label: "Street / Apartment", placeholder: "A-402, Green Meadows" },
      { key: "city", label: "City", placeholder: "Pune" },
      { key: "state", label: "State", placeholder: "Maharashtra" },
      { key: "pin", label: "PIN Code", placeholder: "411045" },
      { key: "country", label: "Country", placeholder: "India" },
    ],
    initialValues: { street: "A-402, Green Meadows", city: "Pune", state: "Maharashtra", pin: "411045", country: "India" },
  },
  {
    id: "emergency",
    icon: Phone,
    title: "Emergency Contact",
    desc: "Family reachouts",
    fields: [
      { key: "name", label: "Contact Name", placeholder: "Suresh" },
      { key: "relation", label: "Relationship", placeholder: "Father" },
      { key: "phone", label: "Phone", type: "tel", placeholder: "+91 98xxxx1234" },
    ],
    initialValues: { name: "Suresh", relation: "Father", phone: "+91 98xxxx1234" },
  },
  {
    id: "id",
    icon: IdCard,
    title: "Identity Proof",
    desc: "PAN, Aadhaar, Passport",
    fields: [
      { key: "pan", label: "PAN Number", placeholder: "ABCDE1234F" },
      { key: "aadhaar", label: "Aadhaar (last 4)", placeholder: "5678" },
      { key: "passport", label: "Passport Number", placeholder: "Optional" },
    ],
    initialValues: { pan: "ABCDE1234F", aadhaar: "5678", passport: "" },
  },
  {
    id: "edu",
    icon: GraduationCap,
    title: "Education",
    desc: "Degrees & institutions",
    fields: [
      { key: "degree", label: "Degree", placeholder: "B.E. Computer Science" },
      { key: "institution", label: "Institution", placeholder: "Pune University" },
      { key: "year", label: "Graduation Year", placeholder: "2022" },
    ],
    initialValues: { degree: "B.E. Computer Science", institution: "Pune University", year: "2022" },
  },
  {
    id: "family",
    icon: UsersIcon,
    title: "Family",
    desc: "Dependents on record",
    fields: [{ key: "details", label: "Family Details", type: "textarea", placeholder: "List dependents and relationship…" }],
    initialValues: { details: "2 dependents listed" },
  },
  {
    id: "bank",
    icon: Landmark,
    title: "Bank Details",
    desc: "Salary account",
    fields: [
      { key: "bank", label: "Bank Name", placeholder: "HDFC Bank" },
      { key: "account", label: "Account Number (last 4)", placeholder: "4321" },
      { key: "ifsc", label: "IFSC Code", placeholder: "HDFC0000456" },
    ],
    initialValues: { bank: "HDFC Bank", account: "****4321", ifsc: "HDFC0000456" },
  },
  {
    id: "docs",
    icon: FileText,
    title: "Documents",
    desc: "Letters, contracts & policies",
    fields: [],
    initialValues: {},
  },
];

// ── Editable Section Content ──────────────────────────────────────────────────

function SectionContent({ section }: { section: Section }) {
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>(section.initialValues);
  const [draft, setDraft] = useState<Record<string, string>>(section.initialValues);
  const [loading, setLoading] = useState(false);

  if (section.id === "docs") {
    const docs = ["Offer Letter", "Appraisal Letter", "NDA Agreement", "HR Policy", "Tax Declaration", "Salary Slip — Jun 2026"];
    return (
      <div className="pl-12 pb-2">
        <ul className="space-y-2">
          {docs.map((d) => (
            <li key={d} className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{d}</span>
              </div>
              <button className="text-xs font-semibold text-teal-600 hover:underline">View</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!editing) {
    return (
      <div className="pl-12 pb-2">
        <div className="rounded-xl bg-accent/50 px-4 py-3 text-sm text-foreground">
          {Object.entries(values).map(([key, val]) => {
            const field = section.fields.find((f) => f.key === key);
            if (!field) return null;
            return (
              <div key={key} className={Object.keys(values).length > 1 ? "mb-2 last:mb-0" : ""}>
                {Object.keys(values).length > 1 && (
                  <span className="text-xs text-muted-foreground">{field.label}: </span>
                )}
                <span>{val || <span className="italic text-muted-foreground">Not set</span>}</span>
              </div>
            );
          })}
        </div>
        <button
          onClick={() => { setDraft({ ...values }); setEditing(true); }}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700"
        >
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
    );
  }

  async function handleSave() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setValues({ ...draft });
    setLoading(false);
    setEditing(false);
    toast.success(`${section.title} updated successfully`);
  }

  return (
    <div className="pl-12 pb-2 space-y-3">
      {section.fields.map((f) => (
        <div key={f.key}>
          <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {f.label}
          </label>
          {f.type === "textarea" ? (
            <textarea
              value={draft[f.key] ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              rows={3}
              placeholder={f.placeholder}
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          ) : (
            <input
              type={f.type ?? "text"}
              value={draft[f.key] ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
        </div>
      ))}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => setEditing(false)}
          className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          <X className="h-3.5 w-3.5" /> Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
        >
          {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : <><Save className="h-3.5 w-3.5" /> Save</>}
        </button>
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user?.name ?? "");
  const [editRole, setEditRole] = useState("Product Engineer");
  const [editDept, setEditDept] = useState("Engineering");
  const [profileLoading, setProfileLoading] = useState(false);

  const summary = [
    { icon: CalendarClock, label: "Joining Date", val: "12 Jan 2023" },
    { icon: History, label: "Experience", val: "3y 6m" },
    { icon: UsersIcon, label: "Reporting Manager", val: "Anita Sharma" },
    { icon: CheckCircle2, label: "Profile Completion", val: "82%" },
  ];

  const activity = [
    { icon: CheckCircle2, label: "Last Login", time: "Today · 09:02 AM", tint: "bg-emerald-100 text-emerald-600" },
    { icon: History, label: "Last Punch In", time: "Today · 09:02 AM", tint: "bg-sky-100 text-sky-600" },
    { icon: ArrowUpRight, label: "Leave Applied", time: "2 days ago · Casual", tint: "bg-violet-100 text-violet-600" },
    { icon: Pencil, label: "Profile Updated", time: "1 week ago · Address", tint: "bg-amber-100 text-amber-600" },
  ];

  const settings: { icon: any; label: string; toggle?: boolean; onToggle?: () => void; value?: string }[] = [
    { icon: dark ? Moon : Sun, label: "Dark Mode", toggle: dark, onToggle: () => setDark(v => !v) },
    { icon: Languages, label: "Language", value: "English" },
    { icon: Bell, label: "Notifications", toggle: notif, onToggle: () => setNotif(v => !v) },
    { icon: Shield, label: "Privacy", value: "Manage" },
    { icon: LifeBuoy, label: "Help & Support", value: "Contact" },
  ];

  const initials = (user?.name ?? "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  async function handleProfileSave() {
    if (!editName.trim()) { toast.error("Name cannot be empty"); return; }
    setProfileLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setUser({ ...(user!), name: editName.trim() });
    setProfileLoading(false);
    setEditMode(false);
    toast.success("Profile updated successfully");
  }

  function handleProfileCancel() {
    setEditName(user?.name ?? "");
    setEditRole("Product Engineer");
    setEditDept("Engineering");
    setEditMode(false);
  }

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader title="My Profile" subtitle="Employee" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Profile Card */}
        <section className="rounded-3xl bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div
              className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-bold text-white"
              style={{ background: "var(--gradient-hero)" }}
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              {editMode ? (
                <div className="space-y-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Full Name</label>
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full max-w-xs rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Role</label>
                      <input
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground uppercase tracking-wide">Department</label>
                      <input
                        value={editDept}
                        onChange={(e) => setEditDept(e.target.value)}
                        className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
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

            {editMode ? (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleProfileCancel}
                  className="inline-flex items-center gap-1.5 rounded-full border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  <X className="h-4 w-4" /> Cancel
                </button>
                <button
                  onClick={handleProfileSave}
                  disabled={profileLoading}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  {profileLoading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                    : <><Save className="h-4 w-4" /> Save Changes</>}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                <Pencil className="h-4 w-4" /> Edit Profile
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {summary.map(({ icon: Icon, label, val }) => (
              <div key={label} className="rounded-2xl border border-border p-3">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-bold">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Personal Info + Sidebar */}
        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-lg font-bold">Personal Information</h3>
            <Accordion type="single" collapsible className="mt-2">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <AccordionItem key={s.id} value={s.id} className="border-b border-border last:border-0">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <SectionContent section={s} />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          <div className="grid gap-6">
            {/* Activity Timeline */}
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Activity Timeline</h3>
              <ol className="mt-3 space-y-3">
                {activity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 place-items-center rounded-xl ${a.tint}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Settings */}
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Settings</h3>
              <ul className="mt-3 space-y-1">
                {settings.map((s) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label}>
                      <button
                        onClick={s.onToggle}
                        className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-accent"
                      >
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="flex-1 text-sm font-medium">{s.label}</span>
                        {typeof s.toggle === "boolean" ? (
                          <span
                            className={`h-6 w-10 rounded-full p-0.5 transition ${s.toggle ? "" : "bg-muted"}`}
                            style={s.toggle ? { background: "var(--gradient-primary)" } : undefined}
                          >
                            <span className={`block h-5 w-5 rounded-full bg-white shadow transition ${s.toggle ? "translate-x-4" : ""}`} />
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{s.value}</span>
                        )}
                      </button>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={() => { setUser(null); navigate({ to: "/login" }); }}
                    className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-destructive hover:bg-destructive/10"
                  >
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/10 text-destructive">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <span className="flex-1 text-sm font-medium">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
