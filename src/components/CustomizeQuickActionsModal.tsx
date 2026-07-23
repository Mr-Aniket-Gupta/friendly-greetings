import { useEffect, useState } from "react";
import { GripVertical, Plus, X, Check } from "lucide-react";
import { ALL_ACTIONS, DEFAULT_IDS } from "@/lib/quick-actions";
import { saveQuickActions } from "@/lib/auth";

export function CustomizeQuickActionsModal({
  open, current, onClose,
}: { open: boolean; current: string[]; onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>(current);
  const [dragId, setDragId] = useState<string | null>(null);

  useEffect(() => { if (open) setSelected(current); }, [open, current]);

  if (!open) return null;

  const available = ALL_ACTIONS.filter((a) => !selected.includes(a.id));

  function move(id: string, targetId: string) {
    if (id === targetId) return;
    const arr = [...selected];
    const from = arr.indexOf(id);
    const to = arr.indexOf(targetId);
    if (from < 0 || to < 0) return;
    arr.splice(from, 1);
    arr.splice(to, 0, id);
    setSelected(arr);
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm animate-fade-in sm:items-center sm:p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-bold">Customize Quick Actions</h2>
            <p className="text-xs text-muted-foreground">Drag to reorder. Tap + to add, x to remove.</p>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-accent">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto p-6 md:grid-cols-2">
          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">On dashboard ({selected.length})</p>
            <ul className="space-y-2">
              {selected.map((id) => {
                const a = ALL_ACTIONS.find((x) => x.id === id);
                if (!a) return null;
                const Icon = a.icon;
                return (
                  <li
                    key={id}
                    draggable
                    onDragStart={() => setDragId(id)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => { if (dragId) move(dragId, id); setDragId(null); }}
                    className={`flex items-center gap-3 rounded-2xl border border-border bg-background p-3 transition ${dragId === id ? "opacity-50" : ""}`}
                  >
                    <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-muted-foreground" />
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${a.tint}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    <button
                      onClick={() => setSelected(selected.filter((x) => x !== id))}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
              {selected.length === 0 && (
                <li className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                  No quick actions selected
                </li>
              )}
            </ul>
          </section>

          <section>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Available ({available.length})</p>
            <ul className="space-y-2">
              {available.map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.id} className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-3">
                    <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${a.tint}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{a.label}</p>
                      <p className="truncate text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    <button
                      onClick={() => setSelected([...selected, a.id])}
                      className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary hover:bg-primary/20"
                      aria-label="Add"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-border px-6 py-4">
          <button
            onClick={() => setSelected(DEFAULT_IDS)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Reset to default
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-full border border-input px-4 py-2 text-sm font-medium hover:bg-accent">
              Cancel
            </button>
            <button
              onClick={() => { saveQuickActions(selected); onClose(); }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white"
              style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
            >
              <Check className="h-4 w-4" /> Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}