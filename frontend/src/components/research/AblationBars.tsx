import { ModelInfoResponse } from "../../api/phish360";
import { pct } from "../../lib/format";

const ABLATION_LABELS: Record<string, string> = {
  full: "Full model",
  minus_url: "Without URL",
  minus_html: "Without HTML/DOM",
  minus_text: "Without Text",
  minus_vision: "Without Vision",
};

export function AblationBars({ ablation }: { ablation: ModelInfoResponse["ablation"] }) {
  const order = ["full", "minus_url", "minus_html", "minus_text", "minus_vision"];
  const entries = order.filter((k) => ablation[k]).map((k) => ({ key: k, metric: ablation[k] }));
  const max = Math.max(...entries.map((e) => e.metric.accuracy));

  return (
    <div className="surface min-w-0 px-5 py-5">
      <p className="mb-5 text-xs font-medium uppercase tracking-wide text-mist-500">Ablation — accuracy by configuration</p>
      <div className="space-y-4">
        {entries.map((e) => {
          const isFull = e.key === "full";
          const widthPct = (e.metric.accuracy / max) * 100;
          return (
            <div key={e.key} className="min-w-0">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className={isFull ? "font-medium text-mist-100" : "text-mist-400"}>{ABLATION_LABELS[e.key]}</span>
                <span className="tabular text-mist-300">{pct(e.metric.accuracy, 2)}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  className={`h-full rounded-full ${isFull ? "bg-signal-scan" : "bg-signal-scan/40"}`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function PriorityRanking({ priority }: { priority: ModelInfoResponse["priority"] }) {
  if (!priority || priority.length === 0) return null;
  return (
    <div className="surface min-w-0 px-5 py-5">
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-mist-500">Modality contribution to fusion</p>
      <p className="mb-4 text-[11px] text-mist-500">
        Measured as accuracy lost when a modality is removed from fusion — not the modality's standalone accuracy.
      </p>
      <div className="space-y-3">
        {priority.map((p, i) => (
          <div key={p.modality} className="flex min-w-0 items-center gap-3">
            <span className="w-5 shrink-0 text-center text-xs text-mist-600">#{i + 1}</span>
            <span className="w-16 shrink-0 text-xs font-medium uppercase text-mist-300">{p.modality}</span>
            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <div
                className="h-full rounded-full bg-signal-scan"
                style={{ width: `${Math.min(100, Math.max(4, (p.fusion_contribution / priority[0].fusion_contribution) * 100))}%` }}
              />
            </div>
            <span className="tabular w-16 shrink-0 text-right text-xs text-mist-300">
              {p.fusion_contribution >= 0 ? "+" : ""}
              {pct(p.fusion_contribution, 2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
