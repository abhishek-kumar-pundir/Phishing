import { Link } from "react-router-dom";
import { StandaloneMetric } from "../../api/phish360";
import { pct } from "../../lib/format";

interface Row {
  key: string;
  label: string;
  metrics: StandaloneMetric | null | undefined;
}

export function MetricsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="border border-surface-border bg-surface-card rounded-lg overflow-hidden min-w-0 font-sans">
      <div className="overflow-x-auto min-w-0">
        <table className="w-full min-w-[640px] text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-surface-border bg-surface-subtle text-[10px] uppercase tracking-wider text-mist-500">
              <th className="px-4 py-3 font-semibold">Model / Pipeline</th>
              <th className="px-4 py-3 text-right font-semibold">Accuracy</th>
              <th className="px-4 py-3 text-right font-semibold">Precision</th>
              <th className="px-4 py-3 text-right font-semibold">Recall</th>
              <th className="px-4 py-3 text-right font-semibold">F1 Score</th>
              <th className="px-4 py-3 text-right font-semibold">ROC-AUC</th>
              <th className="px-4 py-3 text-right font-semibold">PR-AUC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/60">
            {rows.map((r) => {
              const isFusion = r.key === "multimodal" || r.key === "fusion";
              return (
                <tr
                  key={r.key}
                  className={`hover:bg-surface-subtle/40 transition-colors ${
                    isFusion ? "bg-surface-subtle/20 font-semibold" : ""
                  }`}
                >
                  <td className="px-4 py-3">
                    <Link
                      to={`/models/${r.key}`}
                      className={`hover:underline ${isFusion ? "text-brand" : "text-mist-200"}`}
                    >
                      {r.label}
                    </Link>
                  </td>
                  {r.metrics ? (
                    <>
                      <td className="tabular px-4 py-3 text-right text-mist-100">
                        {pct(r.metrics.accuracy, 1)}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-mist-300">
                        {pct(r.metrics.precision, 1)}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-mist-300">
                        {pct(r.metrics.recall, 1)}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-mist-300">
                        {r.metrics.f1.toFixed(3)}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-mist-300">
                        {pct(r.metrics.roc_auc, 1)}
                      </td>
                      <td className="tabular px-4 py-3 text-right text-mist-300">
                        {pct(r.metrics.pr_auc, 1)}
                      </td>
                    </>
                  ) : (
                    <td colSpan={6} className="px-4 py-3 text-right text-[11px] text-mist-600">
                      Unavailable
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
