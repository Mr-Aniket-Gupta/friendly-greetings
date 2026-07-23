import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";
import { PunchCard } from "@/modules/home/PunchCard";
import { WeekStats } from "@/modules/home/WeekStats";
import { QuickActions } from "@/modules/home/QuickActions";

export function HomePage() {
  const { user } = useAuth();
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  const greeting =
    now.getHours() < 12 ? "Good Morning" : now.getHours() < 18 ? "Good Afternoon" : "Good Evening";
  const firstName = (user?.name ?? "there").split(" ")[0];

  return (
    <div className="min-h-screen bg-background pb-16">
      <AppHeader
        title={firstName}
        subtitle={`${greeting} · ${now.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}`}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <section className="grid gap-4 lg:grid-cols-3">
          <PunchCard now={now} />
          <WeekStats />
        </section>

        <QuickActions />
      </main>

      <footer className="mt-16 border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 text-xs text-muted-foreground md:flex-row lg:px-10">
          <p>© 2026 Workday. All rights reserved.</p>
          <p>Made with care for hybrid teams.</p>
        </div>
      </footer>
    </div>
  );
}
