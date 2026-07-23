import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { MapPin, ArrowUpRight, Clock, ChevronRight, Settings2 } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { RequireAuth } from "@/components/RequireAuth";
import { ALL_ACTIONS, DEFAULT_IDS } from "@/lib/quick-actions";
import { getQuickActions, useAuth } from "@/lib/auth";
import { CustomizeQuickActionsModal } from "@/components/CustomizeQuickActionsModal";
import { AnnouncementsMarquee, AllAnnouncementsModal, MOCK_ANNOUNCEMENTS } from "@/components/Announcements";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Workday — Employee Dashboard" },
      { name: "description", content: "Track attendance, leaves, growth and daily activity in one place." },
      { property: "og:title", content: "Workday — Employee Dashboard" },
      { property: "og:description", content: "Your daily workspace: punch in/out, quick actions, announcements." },
    ],
  }),
  component: () => (<RequireAuth><Index /></RequireAuth>),
});

function Index() {
  const { user } = useAuth();
  const [now, setNow] = useState<Date>(() => new Date());
  const [punchedIn, setPunchedIn] = useState(true);
  const [customize, setCustomize] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [ids, setIds] = useState<string[]>(DEFAULT_IDS);

  useEffect(() => {
    const stored = getQuickActions();
    if (stored?.length) setIds(stored);
    const onQa = () => { const s = getQuickActions(); if (s) setIds(s); };
    window.addEventListener("workday:qa", onQa);
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => { window.removeEventListener("workday:qa", onQa); clearInterval(t); };
  }, []);

  const actions = useMemo(
    () => ids.map((id) => ALL_ACTIONS.find((a) => a.id === id)).filter(Boolean) as typeof ALL_ACTIONS,
    [ids],
  );
  const greeting = now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";
  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader
        title={`${firstName} 👋`}
        subtitle={`${greeting} · ${now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}`}
      />

      <main className="mx-auto -mt-10 max-w-7xl px-4 sm:-mt-14 sm:px-6 lg:px-10">
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl bg-card p-6 sm:p-8 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Current Time</p>
                <p className="mt-1 text-4xl font-bold sm:text-5xl">{now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" /> Live
              </span>
            </div>

            <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Today's working hours</p>
                <p className="mt-1 text-2xl font-bold sm:text-3xl">6h 42m</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
                <MapPin className="h-3.5 w-3.5" /> Verified
              </span>
            </div>

            <button
              onClick={() => setPunchedIn((v) => !v)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition hover:opacity-95"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <span className="h-2 w-2 rounded-full bg-white" />
              {punchedIn ? "Punch Out" : "Punch In"}
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid gap-4">
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal-100 text-teal-600"><Clock className="h-5 w-5" /></div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">Punched in at</p>
                  <p className="truncate font-semibold">09:02 AM</p>
                </div>
              </div>
              <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full" style={{ background: "var(--gradient-primary)" }} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">75% of 9h daily goal</p>
            </div>
            <div className="rounded-3xl bg-card p-5" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">This week</p>
              <p className="mt-2 text-2xl font-bold sm:text-3xl">38h 12m</p>
              <div className="mt-4 flex h-16 items-end gap-1.5">
                {[40, 60, 75, 55, 90, 35, 20].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%`, minHeight: 8, background: "var(--gradient-primary)", opacity: h < 40 ? 0.4 : 1 }} />
                ))}
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
                {["M","T","W","T","F","S","S"].map((d,i)=>(<span key={i}>{d}</span>))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Quick Actions</h2>
            <button
              onClick={() => setCustomize(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              <Settings2 className="h-4 w-4" /> Customize
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {actions.map(({ icon: Icon, label, desc, tint, id }) => (
              <button
                key={id}
                className="group relative rounded-2xl bg-card p-4 text-left transition hover:-translate-y-0.5 sm:p-5"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <ChevronRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}><Icon className="h-5 w-5" /></div>
                <p className="mt-4 text-sm font-semibold sm:text-base">{label}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground sm:text-sm">{desc}</p>
              </button>
            ))}
            {actions.length === 0 && (
              <p className="col-span-full rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                No quick actions yet — click Customize to add.
              </p>
            )}
          </div>
        </section>

        <AnnouncementsMarquee items={MOCK_ANNOUNCEMENTS} onShowAll={() => setShowAll(true)} />
      </main>

      <CustomizeQuickActionsModal open={customize} current={ids} onClose={() => setCustomize(false)} />
      <AllAnnouncementsModal open={showAll} items={MOCK_ANNOUNCEMENTS} onClose={() => setShowAll(false)} />

      <footer className="mt-16 border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row lg:px-10">
          <p>© 2026 Workday. All rights reserved.</p>
          <p>Made with care for hybrid teams.</p>
        </div>
      </footer>
    </div>
  );
}