import { ClassificationReportRow } from "../../api/phish360";

function isRow(v: ClassificationReportRow | number): v is ClassificationReportRow {
  return typeof v === "object";
}

export function ClassificationReportView({
  report,
}: {
  report: Record<string, ClassificationReportRow | number>;
}) {
  const rows = Object.entries(report).filter(([, v]) => isRow(v)) as [
    string,
    ClassificationReportRow
  ][];

  return (
    <div className="min-w-0 overflow-x-auto rounded border border-surface-border font-mono text-xs">
      <table className="w-full min-w-[420px] text-left">
        <thead>
          <tr className="border-b border-surface-border bg-surface-subtle text-[10px] uppercase tracking-wider text-mist-500">
            <th className="px-3 py-2 font-semibold">Class Target</th>
            <th className="px-3 py-2 text-right font-semibold">Precision</th>
            <th className="px-3 py-2 text-right font-semibold">Recall</th>
            <th className="px-3 py-2 text-right font-semibold">F1 Score</th>
            <th className="px-3 py-2 text-right font-semibold">Support</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-border/50 text-[11px]">
          {rows.map(([label, r]) => (
            <tr key={label} className="hover:bg-surface-subtle/30">
              <td className="min-w-0 truncate px-3 py-2 text-mist-200 uppercase">{label}</td>
              <td className="tabular px-3 py-2 text-right text-mist-300">{r.precision.toFixed(3)}</td>
              <td className="tabular px-3 py-2 text-right text-mist-300">{r.recall.toFixed(3)}</td>
              <td className="tabular px-3 py-2 text-right text-mist-100 font-semibold">{r["f1-score"].toFixed(3)}</td>
              <td className="tabular px-3 py-2 text-right text-mist-500">{r.support}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
