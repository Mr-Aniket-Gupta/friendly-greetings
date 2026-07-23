import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User, MapPin, Phone, IdCard, GraduationCap, Users as UsersIcon, Landmark, FileText,
  Sun, Moon, Languages, Bell, Shield, LifeBuoy, LogOut,
  Pencil, CalendarClock, History, ArrowUpRight, Award, CheckCircle2,
} from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { setUser, useAuth } from "@/lib/auth";

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

function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);

  const summary = [
    { icon: CalendarClock, label: "Joining Date", val: "12 Jan 2023" },
    { icon: History, label: "Experience", val: "3y 6m" },
    { icon: UsersIcon, label: "Reporting Manager", val: "Anita Sharma" },
    { icon: CheckCircle2, label: "Profile Completion", val: "82%" },
  ];

  const sections = [
    { id: "about", icon: User, title: "About Me", desc: "Bio & personal summary", body: "Passionate product engineer with 3+ years of experience building delightful workplace tools." },
    { id: "address", icon: MapPin, title: "Address", desc: "Current & permanent", body: "A-402, Green Meadows, Pune, MH 411045, India" },
    { id: "emergency", icon: Phone, title: "Emergency Contact", desc: "Family reachouts", body: "Suresh (Father) · +91 98xxxx1234" },
    { id: "id", icon: IdCard, title: "Identity Proof", desc: "PAN, Aadhaar, Passport", body: "PAN: ABCDE1234F · Aadhaar: **** **** 5678" },
    { id: "edu", icon: GraduationCap, title: "Education", desc: "Degrees & institutions", body: "B.E. Computer Science, Pune University, 2022" },
    { id: "family", icon: UsersIcon, title: "Family", desc: "Dependents on record", body: "2 dependents listed" },
    { id: "bank", icon: Landmark, title: "Bank Details", desc: "Salary account", body: "HDFC Bank · A/C ****4321 · IFSC HDFC0000456" },
    { id: "docs", icon: FileText, title: "Documents", desc: "Letters, contracts & policies", body: "6 documents available" },
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

  const initials = (user?.name ?? "U").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader title="My Profile" subtitle="Employee" />

      <main className="mx-auto -mt-10 max-w-7xl px-4 sm:px-6 lg:px-10">
        <section className="rounded-3xl bg-card p-6" style={{ boxShadow: "var(--shadow-card)" }}>
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-bold text-white" style={{ background: "var(--gradient-hero)" }}>
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-bold">{user?.name ?? "Employee"}</h2>
              <p className="text-sm text-muted-foreground">{user?.empId} · Product Engineer · Engineering</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-accent-foreground">Full-time</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">Active</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-700"><Award className="h-3 w-3" /> Star Performer</span>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <Pencil className="h-4 w-4" /> Edit Profile
            </button>
          </div>

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

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl bg-card p-5 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <h3 className="text-lg font-bold">Personal Information</h3>
            <Accordion type="single" collapsible className="mt-2">
              {sections.map((s) => {
                const Icon = s.icon;
                return (
                  <AccordionItem key={s.id} value={s.id} className="border-b border-border last:border-0">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></div>
                        <div>
                          <p className="text-sm font-semibold">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{s.desc}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12 text-sm text-muted-foreground">{s.body}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          <div className="grid gap-6">
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <h3 className="text-base font-bold">Activity Timeline</h3>
              <ol className="mt-3 space-y-3">
                {activity.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <li key={i} className="flex items-center gap-3">
                      <div className={`grid h-9 w-9 place-items-center rounded-xl ${a.tint}`}><Icon className="h-4 w-4" /></div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{a.label}</p>
                        <p className="text-xs text-muted-foreground">{a.time}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

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
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-accent text-accent-foreground"><Icon className="h-4 w-4" /></div>
                        <span className="flex-1 text-sm font-medium">{s.label}</span>
                        {typeof s.toggle === "boolean" ? (
                          <span className={`h-6 w-10 rounded-full p-0.5 transition ${s.toggle ? "" : "bg-muted"}`} style={s.toggle ? { background: "var(--gradient-primary)" } : undefined}>
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
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/10 text-destructive"><LogOut className="h-4 w-4" /></div>
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