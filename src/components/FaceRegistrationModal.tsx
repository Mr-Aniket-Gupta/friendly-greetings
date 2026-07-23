import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, ShieldCheck, X } from "lucide-react";
import { setFaceRegistered } from "@/lib/auth";

export function FaceRegistrationModal({
  open,
  allowSkip = true,
  onDone,
}: {
  open: boolean;
  allowSkip?: boolean;
  onDone: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open) {
      stream?.getTracks().forEach((t) => t.stop());
      setStream(null);
      setCaptured(null);
      setError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function startCamera() {
    setError(null);
    setStarting(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(s);
      // video always mounted — ref is always valid
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play().catch(() => {});
      }
    } catch (e: any) {
      setError(e?.message ?? "Camera access denied");
    } finally {
      setStarting(false);
    }
  }

  function capture() {
    if (!videoRef.current) return;
    const v = videoRef.current;
    const c = document.createElement("canvas");
    c.width = v.videoWidth || 320;
    c.height = v.videoHeight || 320;
    c.getContext("2d")?.drawImage(v, 0, 0, c.width, c.height);
    const url = c.toDataURL("image/jpeg", 0.7);
    setCaptured(url);
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }

  function confirm() {
    if (!captured) return;
    setFaceRegistered(captured);
    onDone();
  }

  function skip() {
    stream?.getTracks().forEach((t) => t.stop());
    onDone();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div className="relative px-6 py-8 text-white" style={{ background: "var(--gradient-hero)" }}>
          {allowSkip && (
            <button
              onClick={skip}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Register your face</h2>
          <p className="mt-1 text-sm text-white/85">
            Face authentication makes daily punch-in faster and more secure. You only need to do this once.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-muted">
            {/* Always mounted video */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover ${stream && !captured ? "block" : "hidden"}`}
            />
            {captured && (
              <img src={captured} alt="Captured" className="h-full w-full object-cover" />
            )}
            {!stream && !captured && (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera className="h-10 w-10" />
                <p className="text-xs">Camera preview</p>
              </div>
            )}
            <div className="pointer-events-none absolute inset-6 rounded-full border-2 border-white/70" />
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</div>
          )}

          <div className="flex flex-wrap gap-2">
            {!captured && !stream && (
              <button
                onClick={startCamera}
                disabled={starting}
                className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                {starting ? "Starting camera…" : "Scan Face"}
              </button>
            )}
            {!captured && stream && (
              <button
                onClick={capture}
                className="flex-1 rounded-full py-3 text-sm font-semibold text-white"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
              >
                Capture
              </button>
            )}
            {captured && (
              <>
                <button
                  onClick={() => { setCaptured(null); startCamera(); }}
                  className="rounded-full border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent"
                >
                  Retake
                </button>
                <button
                  onClick={confirm}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  <CheckCircle2 className="h-4 w-4" /> Confirm & Continue
                </button>
              </>
            )}
            {allowSkip && !captured && (
              <button
                onClick={skip}
                className="rounded-full px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
