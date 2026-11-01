import { useState } from "react";
import { ErrorExample } from "../../api/phish360";
import { pct } from "../../lib/format";
import { Drawer } from "../ui/Drawer";

export function ErrorList({
  examples,
  kind,
}: {
  examples: ErrorExample[];
  kind: "false_positive" | "false_negative";
}) {
  const [selected, setSelected] = useState<ErrorExample | null>(null);

  if (examples.length === 0) {
    return <p className="py-6 text-center text-xs font-mono text-mist-500">No failure examples in this slice.</p>;
  }

  return (
    <>
      <div className="min-w-0 divide-y divide-surface-border/50 font-mono text-xs">
        {examples.map((ex) => (
          <button
            key={ex.sample_id}
            onClick={() => setSelected(ex)}
            className="flex w-full min-w-0 items-center justify-between gap-3 px-2 py-2.5 text-left hover:bg-surface-subtle/50 transition-colors rounded"
          >
            <span className="min-w-0 truncate text-mist-300 font-medium">{ex.sample_id}</span>
            <span className="tabular shrink-0 text-mist-400 font-semibold">{pct(ex.fused_probability, 1)}</span>
          </button>
        ))}
      </div>

      <Drawer
        open={selected != null}
        onClose={() => setSelected(null)}
        title={selected?.sample_id ?? ""}
        subtitle={kind === "false_positive" ? "False positive error" : "False negative error"}
      >
        {selected && (
          <div className="space-y-4 font-sans text-xs">
            <div className="grid grid-cols-2 gap-2 font-mono">
              <MiniStat label="Ground Truth" value={selected.true_label} />
              <MiniStat label="Model Prediction" value={selected.predicted_label} />
              <MiniStat label="Fused Probability" value={pct(selected.fused_probability, 2)} />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-mono uppercase tracking-wider text-mist-500">
                Per-Modality Probabilities
              </p>
              <div className="space-y-2 font-mono">
                {Object.entries(selected.modality_probabilities).map(([m, v]) => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="w-16 shrink-0 text-[11px] uppercase text-mist-400">{m}</span>
                    <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                      <div
                        className="h-full rounded-full bg-brand/80"
                        style={{ width: `${Math.min(100, v * 100)}%` }}
                      />
                    </div>
                    <span className="tabular w-12 shrink-0 text-right text-xs text-mist-300">{pct(v, 1)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded border border-surface-border bg-surface-subtle/40 p-3 text-xs leading-relaxed text-mist-400">
              Offline evaluation error sample from held-out test split. The fused probability crossed the decision threshold due to conflicting signals across modalities.
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-surface-border bg-surface-subtle/50 rounded p-2.5">
      <span className="text-[10px] uppercase text-mist-500 block">{label}</span>
      <span className="text-sm font-semibold text-mist-100 block mt-0.5 truncate">{value}</span>
    </div>
  );
}
