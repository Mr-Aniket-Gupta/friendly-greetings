import { useEffect, useRef, useState } from "react";
import { Camera, ShieldCheck, X, Loader2 } from "lucide-react";

export function FaceAuthModal({
  open,
  onVerified,
  onCancel,
}: {
  open: boolean;
  onVerified: () => void;
  onCancel: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    if (!open) {
      setError(null);
      setVerifying(false);
    }
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function startCamera() {
    setError(null);
    setStarting(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 480, height: 480 },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        await videoRef.current.play();
      }
    } catch (e: any) {
      setError(e?.message ?? "Camera access denied");
    } finally {
      setStarting(false);
    }
  }

  async function verify() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1500));
    setVerifying(false);
    onVerified();
  }

  function cancel() {
    stream?.getTracks().forEach((t) => t.stop());
    setStream(null);
    onCancel();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl">
        <div
          className="relative px-6 py-8 text-white"
          style={{ background: "var(--gradient-hero)" }}
        >
          <button
            onClick={cancel}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Verify Your Identity</h2>
          <p className="mt-1 text-sm text-white/85">
            Face authentication is required to punch in/out securely.
          </p>
        </div>

        <div className="space-y-4 p-6">
          <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-muted">
            {verifying ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                <p className="text-sm font-medium text-foreground">Verifying face…</p>
              </div>
            ) : stream ? (
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Camera className="h-10 w-10" />
                <p className="text-xs">Camera preview</p>
              </div>
            )}
            {!verifying && (
              <div className="pointer-events-none absolute inset-6 rounded-full border-2 border-white/70" />
            )}
          </div>

          {error && (
            <div className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {error}
            </div>
          )}

          {!verifying && (
            <div className="flex flex-wrap gap-2">
              {!stream ? (
                <button
                  onClick={startCamera}
                  disabled={starting}
                  className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition disabled:opacity-60"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  {starting ? "Starting camera…" : "Scan Face"}
                </button>
              ) : (
                <button
                  onClick={verify}
                  className="flex-1 rounded-full py-3 text-sm font-semibold text-white transition"
                  style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}
                >
                  Verify
                </button>
              )}
              <button
                onClick={cancel}
                className="rounded-full border border-input bg-background px-4 py-3 text-sm font-medium hover:bg-accent"
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
