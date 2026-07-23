import { useMemo, useState } from "react";
import { X, Filter } from "lucide-react";

export type Announcement = {
  id: string; tag: string; title: string; date: string; body: string;
};

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  { id: "1", tag: "Company", title: "Town Hall — Q3 highlights", date: "2026-07-23", body: "Join us at 4 PM for the Q3 update, product roadmap and Q&A." },
  { id: "2", tag: "Policy", title: "Updated work-from-home guidelines", date: "2026-07-22", body: "New hybrid attendance rules effective August 1st." },
  { id: "3", tag: "Culture", title: "Wellness week starts Monday", date: "2026-07-21", body: "Yoga, mindfulness sessions and healthy snacks all week." },
  { id: "4", tag: "HR", title: "Open enrollment closes soon", date: "2026-07-18", body: "Review benefits and finalize elections by July 31." },
  { id: "5", tag: "IT", title: "Password rotation reminder", date: "2026-07-15", body: "Update your workspace password for continued access." },
  { id: "6", tag: "Culture", title: "Volunteer day — sign up now", date: "2026-07-10", body: "Company-sponsored volunteer day on August 12." },
  { id: "7", tag: "Company", title: "Office refresh completed", date: "2026-07-05", body: "New collaboration zones on floors 2 & 3 are ready." },
];

export function AnnouncementsMarquee({ items, onShowAll }: { items: Announcement[]; onShowAll: () => void }) {
  const doubled = [...items, ...items];
  return (
    <section className="mt-10">
      <div className="flex items-end justify-between">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Announcements</h2>
        <button
          onClick={onShowAll}
          className="text-sm font-medium text-teal-600 hover:text-teal-700"
        >
          Show all
        </button>
      </div>
      <div className="group relative mt-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />
        <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused]">
          {doubled.map((a, i) => (
            <article
              key={`${a.id}-${i}`}
              className="w-[280px] shrink-0 rounded-2xl bg-card p-5 sm:w-[320px]"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                {a.tag}
              </span>
              <h3 className="mt-3 line-clamp-2 text-base font-semibold text-foreground">{a.title}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AllAnnouncementsModal({
  open, items, onClose,
}: { open: boolean; items: Announcement[]; onClose: () => void }) {
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const filtered = useMemo(() => {
    let list = [...items];
    if (from) list = list.filter((a) => a.date >= from);
    if (to) list = list.filter((a) => a.date <= to);
    list.sort((a, b) => sort === "latest" ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date));
    return list;
  }, [items, sort, from, to]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">All Announcements</h2>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-6 py-3 text-xs">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <label className="flex items-center gap-1">From
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1" />
          </label>
          <label className="flex items-center gap-1">To
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-md border border-input bg-background px-2 py-1" />
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value as "latest" | "oldest")} className="rounded-md border border-input bg-background px-2 py-1">
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
          {(from || to) && (
            <button onClick={() => { setFrom(""); setTo(""); }} className="text-teal-600 hover:underline">Clear</button>
          )}
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto p-6">
          {filtered.map((a) => (
            <article key={a.id} className="rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">{a.tag}</span>
                <span className="text-xs text-muted-foreground">{new Date(a.date).toLocaleDateString()}</span>
              </div>
              <h3 className="mt-2 text-base font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.body}</p>
            </article>
          ))}
          {filtered.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No announcements match your filters.</p>}
        </div>
      </div>
    </div>
  );
}