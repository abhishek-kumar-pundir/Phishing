import { UnifiedScanResult } from "../../lib/scanResult";
import { domainOf, durationLabel, pct } from "../../lib/format";

export function VerdictHero({ result }: { result: UnifiedScanResult }) {
  const { fusion } = result;
  const known = fusion.probability != null && fusion.label != null;
  const isPhishing = fusion.label === "phishing";

  const tone = !known ? "idle" : isPhishing ? "danger" : "safe";
  const toneClasses = {
    idle: { ring: "border-white/10", glow: "", text: "text-mist-300", chip: "bg-white/[0.06] text-mist-300 border-white/10" },
    danger: {
      ring: "border-signal-danger/30",
      glow: "shadow-glowDanger",
      text: "text-signal-dangerSoft",
      chip: "bg-signal-danger/12 text-signal-dangerSoft border-signal-danger/30",
    },
    safe: {
      ring: "border-signal-safe/30",
      glow: "shadow-glowSafe",
      text: "text-signal-safeSoft",
      chip: "bg-signal-safe/12 text-signal-safeSoft border-signal-safe/30",
    },
  }[tone];

  const verdictWord = !known ? "No verdict" : isPhishing ? "Likely phishing" : "Likely legitimate";

  return (
    <div className={`surface relative overflow-hidden px-6 py-10 text-center sm:px-10 sm:py-14 ${toneClasses.ring} ${toneClasses.glow}`}>
      <div className="pointer-events-none absolute inset-0 faint-grid-bg opacity-60" />
      <div className="relative">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${toneClasses.chip}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          FINAL VERDICT
        </span>

        <h2 className={`mt-4 font-display text-2xl font-semibold sm:text-4xl ${toneClasses.text}`}>{verdictWord}</h2>

        <p className={`tabular mt-3 font-display text-5xl font-bold sm:text-6xl ${toneClasses.text}`}>
          {pct(fusion.probability, 0)}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">phishing probability</p>

        <div className="mx-auto mt-6 h-px w-40 bg-white/10" />

        <p className="mt-4 text-xs text-mist-500">
          threshold: {pct(fusion.threshold, 0)} · all {Object.values(result.scores).filter((v) => v != null).length} available modalities analyzed
        </p>

        <div className="mx-auto mt-6 flex max-w-md min-w-0 flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-mist-400">
          <span className="min-w-0 max-w-full truncate font-mono">{domainOf(result.url)}</span>
          {result.statusCode != null && <span>HTTP {result.statusCode}</span>}
          <span>{durationLabel(result.fusion.durationMs)} scan</span>
        </div>
      </div>
    </div>
  );
}
