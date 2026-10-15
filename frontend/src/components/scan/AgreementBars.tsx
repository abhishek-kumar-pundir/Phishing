import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";

const LABELS: Record<Modality | "fusion", string> = {
  url: "URL",
  html: "HTML",
  text: "TEXT",
  vision: "VISION",
  fusion: "FUSION",
};

const BAR_COLOR: Record<string, string> = {
  safe: "bg-signal-safe",
  warn: "bg-signal-warn",
  danger: "bg-signal-danger",
  idle: "bg-mist-700",
};

function Row({ label, value, emphasized }: { label: string; value: number | null; emphasized?: boolean }) {
  const tone = riskTone(value);
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className={`w-14 shrink-0 text-xs font-medium ${emphasized ? "text-mist-100" : "text-mist-400"}`}>{label}</span>
      <div className="h-2.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
        {value != null && (
          <div
            className={`h-full rounded-full ${BAR_COLOR[tone]} ${emphasized ? "shadow-glow" : ""}`}
            style={{ width: `${Math.min(100, Math.max(2, value * 100))}%` }}
          />
        )}
      </div>
      <span className="tabular w-11 shrink-0 text-right text-xs text-mist-300">{pct(value, 0)}</span>
    </div>
  );
}

export function AgreementBars({ result }: { result: UnifiedScanResult }) {
  const scores = result.scores;
  const values = (["url", "html", "text", "vision"] as Modality[]).map((m) => scores[m] ?? null);
  const spread =
    values.filter((v) => v != null).length > 1
      ? Math.max(...(values.filter((v) => v != null) as number[])) - Math.min(...(values.filter((v) => v != null) as number[]))
      : 0;

  return (
    <div className="surface min-w-0 px-5 py-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Model agreement</p>
      <div className="space-y-3">
        <Row label={LABELS.url} value={scores.url ?? null} />
        <Row label={LABELS.html} value={scores.html ?? null} />
        <Row label={LABELS.text} value={scores.text ?? null} />
        <Row label={LABELS.vision} value={scores.vision ?? null} />
        <div className="pt-1">
          <Row label={LABELS.fusion} value={result.fusion.probability} emphasized />
        </div>
      </div>
      {spread > 0.3 && (
        <p className="mt-4 text-xs leading-relaxed text-mist-400">
          Modalities disagree by {pct(spread, 0)} on this page — the fusion model weighs all available evidence together
          rather than trusting a single signal.
        </p>
      )}
    </div>
  );
}
