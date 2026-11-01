import { ModelInfoResponse } from "../../api/phish360";
import { pct } from "../../lib/format";

const ABLATION_LABELS: Record<string, string> = {
  full: "Full Multimodal Model (Baseline)",
  minus_url: "Without URL Features (-URL)",
  minus_html: "Without DOM Structure (-DOM)",
  minus_text: "Without Text Semantics (-Text)",
  minus_vision: "Without Visual Layout (-Vision)",
};

export function AblationBars({ ablation }: { ablation: ModelInfoResponse["ablation"] }) {
  const order = ["full", "minus_url", "minus_html", "minus_text", "minus_vision"];
  const entries = order.filter((k) => ablation[k]).map((k) => ({ key: k, metric: ablation[k] }));
  const max = Math.max(...entries.map((e) => e.metric.accuracy));

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-4">
      <div className="border-b border-surface-border pb-2">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
          Ablation Accuracy Comparison
        </h3>
        <p className="text-[11px] text-mist-400 mt-0.5">
          Empirical test accuracy when each input modality is excluded from the fused meta-classifier.
        </p>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {entries.map((e) => {
          const isFull = e.key === "full";
          const widthPct = (e.metric.accuracy / max) * 100;
          return (
            <div key={e.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className={isFull ? "font-semibold text-brand" : "text-mist-300"}>
                  {ABLATION_LABELS[e.key]}
                </span>
                <span className="tabular text-mist-200 font-semibold">{pct(e.metric.accuracy, 2)}</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-subtle">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${isFull ? "bg-brand" : "bg-brand/50"}`}
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
    <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-3">
      <div className="border-b border-surface-border pb-2">
        <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
          Modality Priority Ranking
        </h3>
        <p className="text-[11px] text-mist-400 mt-0.5">
          Measured as classification accuracy lost when a modality is removed from fusion.
        </p>
      </div>

      <div className="space-y-2.5 font-mono text-xs">
        {priority.map((p, i) => (
          <div key={p.modality} className="flex items-center gap-3">
            <span className="w-5 shrink-0 text-center text-xs text-mist-500 font-semibold">#{i + 1}</span>
            <span className="w-16 shrink-0 text-[11px] font-medium uppercase text-mist-200">{p.modality}</span>
            <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-subtle">
              <div
                className="h-full rounded-full bg-brand/80"
                style={{
                  width: `${Math.min(100, Math.max(4, (p.fusion_contribution / priority[0].fusion_contribution) * 100))}%`,
                }}
              />
            </div>
            <span className="tabular w-16 shrink-0 text-right text-[11px] text-mist-300 font-semibold">
              -{pct(p.fusion_contribution, 2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
