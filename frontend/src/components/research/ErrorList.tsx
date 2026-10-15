import { useState } from "react";
import { ErrorExample } from "../../api/phish360";
import { pct } from "../../lib/format";
import { Drawer } from "../ui/Drawer";

export function ErrorList({ examples, kind }: { examples: ErrorExample[]; kind: "false_positive" | "false_negative" }) {
  const [selected, setSelected] = useState<ErrorExample | null>(null);

  if (examples.length === 0) {
    return <p className="py-6 text-center text-sm text-mist-500">None in this set.</p>;
  }

  return (
    <>
      <div className="min-w-0 divide-y divide-white/[0.05]">
        {examples.map((ex) => (
          <button
            key={ex.sample_id}
            onClick={() => setSelected(ex)}
            className="flex w-full min-w-0 items-center justify-between gap-3 px-1 py-2.5 text-left hover:bg-white/[0.02]"
          >
            <span className="min-w-0 truncate font-mono text-xs text-mist-300">{ex.sample_id}</span>
            <span className="tabular shrink-0 text-xs text-mist-500">{pct(ex.fused_probability, 0)}</span>
          </button>
        ))}
      </div>

      <Drawer
        open={selected != null}
        onClose={() => setSelected(null)}
        title={selected?.sample_id ?? ""}
        subtitle={kind === "false_positive" ? "False positive" : "False negative"}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <MiniStat label="Actual label" value={selected.true_label} />
              <MiniStat label="Predicted" value={selected.predicted_label} />
              <MiniStat label="Fused probability" value={pct(selected.fused_probability, 1)} />
            </div>
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-wide text-mist-500">Per-modality probabilities</p>
              <div className="space-y-2">
                {Object.entries(selected.modality_probabilities).map(([m, v]) => (
                  <div key={m} className="flex items-center gap-3">
                    <span className="w-14 shrink-0 text-xs uppercase text-mist-400">{m}</span>
                    <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-signal-scan/60" style={{ width: `${Math.min(100, v * 100)}%` }} />
                    </div>
                    <span className="tabular w-10 shrink-0 text-right text-xs text-mist-300">{pct(v, 0)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-3 text-xs leading-relaxed text-mist-400">
              This sample comes from the offline held-out test set (identified by sample id, not a live URL). The
              fused probability landed on the wrong side of the {pct(0.5, 0)} threshold even though{" "}
              {kind === "false_positive"
                ? "the true label is legitimate."
                : "the true label is phishing."}{" "}
              Compare the per-modality bars above to see whether one modality disagreed with the rest, or all four
              modalities were confidently wrong together.
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-tight min-w-0 px-3 py-2">
      <p className="text-[10px] uppercase text-mist-500">{label}</p>
      <p className="truncate text-sm capitalize text-mist-100">{value}</p>
    </div>
  );
}
