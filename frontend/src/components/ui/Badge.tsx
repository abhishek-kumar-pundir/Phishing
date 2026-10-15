type Tone = "safe" | "danger" | "warn" | "idle" | "scan";

const TONE_CLASSES: Record<Tone, string> = {
  safe: "bg-signal-safe/15 text-signal-safeSoft border-signal-safe/30",
  danger: "bg-signal-danger/15 text-signal-dangerSoft border-signal-danger/30",
  warn: "bg-signal-warn/15 text-signal-warn border-signal-warn/30",
  idle: "bg-white/[0.06] text-mist-400 border-white/10",
  scan: "bg-signal-scan/15 text-signal-scanSoft border-signal-scan/30",
};

export function Badge({ tone = "idle", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
