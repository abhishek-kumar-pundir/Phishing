import { Link } from "react-router-dom";
import { ScanRecord } from "../../api/phish360";
import { domainOf, pct, timeAgo } from "../../lib/format";

export function HistoryTable({ scans }: { scans: ScanRecord[] }) {
  return (
    <div className="border border-surface-border bg-surface-card rounded-lg overflow-hidden min-w-0 font-sans">
      <div className="overflow-x-auto min-w-0">
        <table className="w-full min-w-[720px] text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-surface-border bg-surface-subtle text-[10px] uppercase tracking-wider text-mist-500">
              <th className="px-4 py-3 font-semibold">Timestamp</th>
              <th className="px-4 py-3 font-semibold">Target Domain</th>
              <th className="px-4 py-3 font-semibold">Verdict</th>
              <th className="px-4 py-3 font-semibold text-right">Fused</th>
              <th className="px-4 py-3 font-semibold text-right">URL</th>
              <th className="px-4 py-3 font-semibold text-right">DOM</th>
              <th className="px-4 py-3 font-semibold text-right">Text</th>
              <th className="px-4 py-3 font-semibold text-right">Vision</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border/50 text-[11px]">
            {scans.map((s) => {
              const isPhish = s.predicted_label === "phishing";
              const isLegit = s.predicted_label === "legitimate";
              const needsReview = Boolean(s.needs_review);

              return (
                <tr
                  key={s.id}
                  className="hover:bg-surface-subtle/40 transition-colors"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-mist-500 text-[10px]">
                    {timeAgo(s.ts)}
                  </td>
                  <td className="max-w-[220px] truncate px-4 py-3">
                    <Link
                      to={`/history/${s.id}`}
                      className="text-mist-200 hover:text-brand hover:underline font-semibold block truncate"
                      title={s.url}
                    >
                      {domainOf(s.url) || s.url}
                    </Link>
                    <span className="text-[10px] text-mist-500">#{s.id}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isPhish
                            ? "bg-verdict-phish"
                            : isLegit
                            ? "bg-verdict-legit"
                            : "bg-mist-600"
                        }`}
                      />
                      <span
                        className={`font-semibold uppercase text-[10px] ${
                          isPhish
                            ? "text-verdict-phish"
                            : isLegit
                            ? "text-verdict-legit"
                            : "text-mist-500"
                        }`}
                      >
                        {s.predicted_label ?? "unknown"}
                      </span>
                      {needsReview && (
                        <span className="text-[9px] uppercase tracking-wider text-verdict-warn bg-verdict-warn/10 border border-verdict-warn/30 px-1 py-0.2 rounded ml-1">
                          REVIEW
                        </span>
                      )}
                    </div>
                  </td>
                  <td
                    className={`tabular px-4 py-3 text-right font-semibold ${
                      isPhish
                        ? "text-verdict-phish"
                        : isLegit
                        ? "text-verdict-legit"
                        : "text-mist-100"
                    }`}
                  >
                    {pct(s.fused_probability, 1)}
                  </td>
                  <td className="tabular px-4 py-3 text-right text-mist-400">
                    {pct(s.score_url, 0)}
                  </td>
                  <td className="tabular px-4 py-3 text-right text-mist-400">
                    {pct(s.score_html, 0)}
                  </td>
                  <td className="tabular px-4 py-3 text-right text-mist-400">
                    {pct(s.score_text, 0)}
                  </td>
                  <td className="tabular px-4 py-3 text-right text-mist-400">
                    {pct(s.score_vision, 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
