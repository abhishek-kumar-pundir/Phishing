import { Link } from "react-router-dom";
import { ScanRecord } from "../../api/phish360";
import { Badge } from "../ui/Badge";
import { domainOf, pct, timeAgo } from "../../lib/format";

export function HistoryTable({ scans }: { scans: ScanRecord[] }) {
  return (
    <div className="surface min-w-0 overflow-hidden">
      <div className="min-w-0 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wide text-mist-500">
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Domain</th>
              <th className="px-4 py-3 font-medium">Verdict</th>
              <th className="px-4 py-3 font-medium text-right">Fused</th>
              <th className="px-4 py-3 font-medium text-right">URL</th>
              <th className="px-4 py-3 font-medium text-right">DOM</th>
              <th className="px-4 py-3 font-medium text-right">Text</th>
              <th className="px-4 py-3 font-medium text-right">Vision</th>
            </tr>
          </thead>
          <tbody>
            {scans.map((s) => (
              <tr key={s.id} className="border-b border-white/[0.04] last:border-b-0 hover:bg-white/[0.02]">
                <td className="whitespace-nowrap px-4 py-3 text-xs text-mist-500">{timeAgo(s.ts)}</td>
                <td className="max-w-[220px] truncate px-4 py-3">
                  <Link to={`/history/${s.id}`} className="truncate font-mono text-xs text-signal-scanSoft hover:underline">
                    {domainOf(s.url)}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  {s.predicted_label === "phishing" ? (
                    <Badge tone="danger">Phishing</Badge>
                  ) : s.predicted_label === "legitimate" ? (
                    <Badge tone="safe">Legit</Badge>
                  ) : (
                    <Badge tone="idle">Unknown</Badge>
                  )}
                </td>
                <td className="tabular px-4 py-3 text-right text-mist-100">{pct(s.fused_probability, 0)}</td>
                <td className="tabular px-4 py-3 text-right text-mist-500">{pct(s.score_url, 0)}</td>
                <td className="tabular px-4 py-3 text-right text-mist-500">{pct(s.score_html, 0)}</td>
                <td className="tabular px-4 py-3 text-right text-mist-500">{pct(s.score_text, 0)}</td>
                <td className="tabular px-4 py-3 text-right text-mist-500">{pct(s.score_vision, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
