type Tone = "safe" | "danger" | "warn" | "idle" | "scan";

const TONE_CLASSES: Record<Tone, string> = {
  safe: "bg-verdict-legit/10 text-verdict-legit border-verdict-legit/30",
  danger: "bg-verdict-phish/10 text-verdict-phish border-verdict-phish/30",
  warn: "bg-verdict-warn/10 text-verdict-warn border-verdict-warn/30",
  idle: "bg-surface-subtle text-mist-400 border-surface-border",
  scan: "bg-brand/10 text-brand border-brand/30",
};

export function Badge({ tone = "idle", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
