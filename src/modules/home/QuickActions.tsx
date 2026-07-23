import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronRight, Settings2 } from "lucide-react";
import { ALL_ACTIONS, DEFAULT_IDS } from "@/lib/quick-actions";
import { getQuickActions } from "@/lib/auth";
import { CustomizeQuickActionsModal } from "@/components/CustomizeQuickActionsModal";
import {
  AnnouncementsMarquee,
  AllAnnouncementsModal,
  MOCK_ANNOUNCEMENTS,
} from "@/components/Announcements";
import { useEffect } from "react";

export function QuickActions() {
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[]>(DEFAULT_IDS);
  const [customize, setCustomize] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const stored = getQuickActions();
    if (stored?.length) setIds(stored);
    const onQa = () => {
      const s = getQuickActions();
      if (s) setIds(s);
    };
    window.addEventListener("workday:qa", onQa);
    return () => window.removeEventListener("workday:qa", onQa);
  }, []);

  const actions = useMemo(
    () =>
      ids
        .map((id) => ALL_ACTIONS.find((a) => a.id === id))
        .filter(Boolean) as typeof ALL_ACTIONS,
    [ids],
  );

  return (
    <>
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
              onClick={() => navigate({ to: "/attendance" })}
              className="group relative rounded-2xl bg-card p-4 text-left transition hover:-translate-y-0.5 sm:p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <ChevronRight className="absolute right-3 top-3 h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
              <div className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}>
                <Icon className="h-5 w-5" />
              </div>
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

      <CustomizeQuickActionsModal
        open={customize}
        current={ids}
        onClose={() => setCustomize(false)}
      />
      <AllAnnouncementsModal
        open={showAll}
        items={MOCK_ANNOUNCEMENTS}
        onClose={() => setShowAll(false)}
      />
    </>
  );
}
