import { useState } from "react";
import { MapPin, ArrowUpRight } from "lucide-react";
import { FaceAuthModal } from "@/components/FaceAuthModal";
import { toast } from "sonner";

type PunchState = "idle" | "punched_in";

export function PunchCard({ now }: { now: Date }) {
  const [punchState, setPunchState] = useState<PunchState>("idle");
  const [punchInTime, setPunchInTime] = useState<string | null>(null);
  const [faceOpen, setFaceOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<"in" | "out" | null>(null);

  function requestPunch(action: "in" | "out") {
    setPendingAction(action);
    setFaceOpen(true);
  }

  function handleVerified() {
    setFaceOpen(false);
    if (pendingAction === "in") {
      const t = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      setPunchInTime(t);
      setPunchState("punched_in");
      toast.success(`Punched in at ${t}`);
    } else {
      const t = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
      setPunchState("idle");
      toast.success(`Punched out at ${t}`);
      setPunchInTime(null);
    }
    setPendingAction(null);
  }

  function handleCancel() {
    setFaceOpen(false);
    setPendingAction(null);
  }

  const timeStr = now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

  return (
    <>
      <div className="rounded-3xl bg-card p-6 sm:p-8 lg:col-span-2" style={{ boxShadow: "var(--shadow-card)" }}>
        {/* Time */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Current Time
            </p>
            <p className="mt-1 text-4xl font-bold sm:text-5xl">{timeStr}</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
            <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" /> Live
          </span>
        </div>

        {/* Working hours */}
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Today's working hours
            </p>
            <p className="mt-1 text-2xl font-bold sm:text-3xl">
              {punchState === "punched_in" ? "In progress…" : "—"}
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs text-secondary-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {punchState === "punched_in" ? "Punched In" : "Not Punched"}
          </span>
        </div>

        {/* Status info */}
        {punchState === "punched_in" && punchInTime && (
          <div className="mt-4 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-800">
              Punched in at {punchInTime}
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">Face verified · HQ — 4th Floor</p>
          </div>
        )}

        {/* Punch Button */}
        {punchState === "idle" ? (
          <button
            onClick={() => requestPunch("in")}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition hover:opacity-95"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
          >
            <span className="h-2 w-2 rounded-full bg-white" />
            Punch In
            <ArrowUpRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => requestPunch("out")}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition hover:opacity-95"
            style={{ background: "linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)", boxShadow: "var(--shadow-glow)" }}
          >
            <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
            Punch Out
            <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <FaceAuthModal
        open={faceOpen}
        title={pendingAction === "in" ? "Verify to Punch In" : "Verify to Punch Out"}
        subtitle="Scan your face to confirm your attendance."
        onVerified={handleVerified}
        onCancel={handleCancel}
      />
    </>
  );
}
