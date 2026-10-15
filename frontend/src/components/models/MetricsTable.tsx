import { Link } from "react-router-dom";
import { Modality, StandaloneMetric } from "../../api/phish360";
import { pct } from "../../lib/format";

interface Row {
  key: string;
  label: string;
  metrics: StandaloneMetric | null | undefined;
}

export function MetricsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="surface min-w-0 overflow-hidden">
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wide text-mist-500">
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 text-right font-medium">Accuracy</th>
              <th className="px-4 py-3 text-right font-medium">Precision</th>
              <th className="px-4 py-3 text-right font-medium">Recall</th>
              <th className="px-4 py-3 text-right font-medium">F1</th>
              <th className="px-4 py-3 text-right font-medium">ROC-AUC</th>
              <th className="px-4 py-3 text-right font-medium">PR-AUC</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <Link to={`/models/${r.key}`} className="font-medium text-signal-scanSoft hover:underline">
                    {r.label}
                  </Link>
                </td>
                {r.metrics ? (
                  <>
                    <td className="tabular px-4 py-3 text-right text-mist-100">{pct(r.metrics.accuracy, 1)}</td>
                    <td className="tabular px-4 py-3 text-right text-mist-100">{pct(r.metrics.precision, 1)}</td>
                    <td className="tabular px-4 py-3 text-right text-mist-100">{pct(r.metrics.recall, 1)}</td>
                    <td className="tabular px-4 py-3 text-right text-mist-100">{pct(r.metrics.f1, 1)}</td>
                    <td className="tabular px-4 py-3 text-right text-mist-100">{pct(r.metrics.roc_auc, 1)}</td>
                    <td className="tabular px-4 py-3 text-right text-mist-100">{pct(r.metrics.pr_auc, 1)}</td>
                  </>
                ) : (
                  <td colSpan={6} className="px-4 py-3 text-right text-xs text-mist-600">
                    Not evaluated yet
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
