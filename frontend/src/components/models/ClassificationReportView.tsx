import { ClassificationReportRow } from "../../api/phish360";

function isRow(v: ClassificationReportRow | number): v is ClassificationReportRow {
  return typeof v === "object";
}

export function ClassificationReportView({ report }: { report: Record<string, ClassificationReportRow | number> }) {
  const rows = Object.entries(report).filter(([, v]) => isRow(v)) as [string, ClassificationReportRow][];

  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-white/[0.06]">
      <table className="w-full min-w-[420px] text-left text-xs">
        <thead>
          <tr className="border-b border-white/[0.06] text-[10px] uppercase tracking-wide text-mist-500">
            <th className="px-3 py-2 font-medium">Class</th>
            <th className="px-3 py-2 text-right font-medium">Precision</th>
            <th className="px-3 py-2 text-right font-medium">Recall</th>
            <th className="px-3 py-2 text-right font-medium">F1</th>
            <th className="px-3 py-2 text-right font-medium">Support</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, r]) => (
            <tr key={label} className="border-b border-white/[0.04] last:border-b-0">
              <td className="min-w-0 truncate px-3 py-1.5 capitalize text-mist-300">{label}</td>
              <td className="tabular px-3 py-1.5 text-right text-mist-100">{r.precision.toFixed(3)}</td>
              <td className="tabular px-3 py-1.5 text-right text-mist-100">{r.recall.toFixed(3)}</td>
              <td className="tabular px-3 py-1.5 text-right text-mist-100">{r["f1-score"].toFixed(3)}</td>
              <td className="tabular px-3 py-1.5 text-right text-mist-500">{r.support}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
