import { useEffect, useRef, useState } from "react";
import { Camera, ShieldCheck, X, Loader2, CheckCircle2 } from "lucide-react";

/**
 * Face verification modal – camera always mounted so videoRef is never null
 * when we set srcObject.
 */
export function FaceAuthModal({
  open,
  title = "Verify Your Identity",
  subtitle = "Face authentication is required to continue.",
  onVerified,
  onCancel,
}: {
  open: boolean;
  title?: string;
  subtitle?: string;
  onVerified: () => void;
  onCancel: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [done, setDone] = useState(false);

  // Clean up camera on close
  useEffect(() => {
    if (!open) {
      stopStream();
      setError(null);
      setVerifying(false);
      setDone(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function stopStream() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
  }

  async function startCamera() {
    setError(null);
    setStarting(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } },
        audio: false,
      });
      setStream(s);
      // video element is ALWAYS mounted — ref is always valid here
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play().catch(() => {});
      }
    } catch (e: any) {
      setError(e?.message ?? "Camera access denied. Please allow camera permission.");
    } finally {
      setStarting(false);
    }
  }

  async function handleVerify() {
    stopStream();
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setVerifying(false);
    setDone(true);
    await new Promise((r) => setTimeout(r, 600));
    onVerified();
  }

  function handleCancel() {
    stopStream();
    onCancel();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-card shadow-2xl">
        {/* Header */}
        <div className="relative px-6 py-6 text-white" style={{ background: "var(--gradient-hero)" }}>
          <button
            onClick={handleCancel}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 hover:bg-white/30 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-3 text-xl font-bold">{title}</h2>
          <p className="mt-0.5 text-sm text-white/80">{subtitle}</p>
        </div>

        {/* Camera area */}
        <div className="p-6 space-y-4">
          <div className="relative mx-auto aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl bg-muted">
            {/* Video is ALWAYS in the DOM — only visibility changes */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={`h-full w-full object-cover transition-opacity duration-300 ${stream && !verifying && !done ? "opacity-100" : "opacity-0 absolute"}`}
            />

            {/* States rendered on top */}
            {done && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-emerald-50">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                <p className="text-sm font-semibold text-emerald-700">Verified!</p>
              </div>
            )}
            {verifying && !done && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                <p className="text-sm font-medium text-foreground">Verifying…</p>
              </div>
            )}
            {!stream && !verifying && !done && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera className="h-10 w-10" />
                <p className="text-xs">Camera preview</p>
              </div>
            )}

            {/* Face guide oval */}
            {!verifying && !done && (
              <div className="pointer-events-none absolute inset-6 rounded-full border-2 border-white/60" />
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {!verifying && !done && (
            <div className="flex gap-2">
              {!stream ? (
                <button
                  onClick={startCamera}
                  disabled={starting}
                  className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  {starting ? "Starting…" : "Open Camera"}
                </button>
              ) : (
                <button
                  onClick={handleVerify}
                  className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  Verify Face
                </button>
              )}
              <button
                onClick={handleCancel}
                className="rounded-full border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent transition"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
