import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Sun, Moon, Languages, Bell, Shield, LifeBuoy, LogOut,
  CheckCircle2, History, ArrowUpRight, Pencil,
} from "lucide-react";
import { setUser } from "@/lib/auth";

const ACTIVITY = [
  { icon: CheckCircle2, label: "Last Login", time: "Today · 09:02 AM", tint: "bg-emerald-100 text-emerald-600" },
  { icon: History, label: "Last Punch In", time: "Today · 09:02 AM", tint: "bg-sky-100 text-sky-600" },
  { icon: ArrowUpRight, label: "Leave Applied", time: "2 days ago · Casual", tint: "bg-violet-100 text-violet-600" },
  { icon: Pencil, label: "Profile Updated", time: "1 week ago · Address", tint: "bg-amber-100 text-amber-600" },
];

export function ProfileSidebar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);

  const settings: { icon: any; label: string; toggle?: boolean; onToggle?: () => void; value?: string }[] = [
    { icon: dark ? Moon : Sun, label: "Dark Mode", toggle: dark, onToggle: () => setDark((v) => !v) },
    { icon: Languages, label: "Language", value: "English" },
    { icon: Bell, label: "Notifications", toggle: notif, onToggle: () => setNotif((v) => !v) },
    { icon: Shield, label: "Privacy", value: "Manage" },
    { icon: LifeBuoy, label: "Help & Support", value: "Contact" },
  ];

  return (
    <div className="grid gap-6">
      {/* Activity Timeline */}
      <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-base font-bold">Activity Timeline</h3>
        <ol className="mt-3 space-y-3">
          {ACTIVITY.map((a, i) => {
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

      {/* Settings */}
      <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <h3 className="text-base font-bold">Settings</h3>
        <ul className="mt-3 space-y-1">
          {settings.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.label}>
                <button onClick={s.onToggle} className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-accent">
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
            <button onClick={() => { setUser(null); navigate({ to: "/login" }); }}
              className="flex w-full items-center gap-3 rounded-xl p-2 text-left text-destructive hover:bg-destructive/10">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/10 text-destructive"><LogOut className="h-4 w-4" /></div>
              <span className="flex-1 text-sm font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
