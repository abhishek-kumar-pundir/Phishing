import { Link, useNavigate } from "react-router-dom";
import { UrlForm } from "../components/scan/UrlForm";
import { useScanContext } from "../context/ScanContext";
import { PredictRequestInput } from "../api/phish360";
import { useScanHistory } from "../hooks/useScanHistory";
import { domainOf, pct } from "../lib/format";

export default function ScanInputPage() {
  const { startScan, pipeline } = useScanContext();
  const { scans, loading } = useScanHistory();
  const navigate = useNavigate();

  const handleSubmit = (input: PredictRequestInput) => {
    const id = startScan(input);
    navigate(`/scan/${id}`);
  };

  const recentFive = scans.slice(0, 5);

  return (
    <div className="mx-auto max-w-3xl space-y-6 min-w-0 font-sans">
      <UrlForm onSubmit={handleSubmit} busy={pipeline.phase === "running"} />

      {/* Recent Investigations Quick Access */}
      {!loading && recentFive.length > 0 && (
        <div className="border border-surface-border bg-surface-card rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-surface-border pb-2">
            <span className="font-mono text-[10px] text-mist-500 uppercase tracking-wider">
              Recent Forensic Investigations
            </span>
            <Link
              to="/history"
              className="font-mono text-[11px] text-brand hover:underline"
            >
              View All History →
            </Link>
          </div>

          <div className="divide-y divide-surface-border/50">
            {recentFive.map((scan) => {
              const isPhish = scan.predicted_label === "phishing";
              const score = scan.fused_probability;

              return (
                <Link
                  key={scan.id}
                  to={`/scan/${scan.id}`}
                  className="py-2.5 flex items-center justify-between hover:bg-surface-subtle/50 px-2 rounded transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <span className="font-mono text-xs text-mist-200 block truncate">
                      {domainOf(scan.url) || scan.url}
                    </span>
                    <span className="font-mono text-[10px] text-mist-500">
                      #{scan.id} · {scan.ts}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`font-mono text-xs font-semibold tabular ${
                        isPhish ? "text-verdict-phish" : "text-verdict-legit"
                      }`}
                    >
                      {score != null ? pct(score, 1) : "—"}
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase px-1.5 py-0.5 rounded border ${
                        isPhish
                          ? "border-verdict-phish/40 text-verdict-phish bg-verdict-phish/10"
                          : "border-verdict-legit/40 text-verdict-legit bg-verdict-legit/10"
                      }`}
                    >
                      {scan.predicted_label ?? "unknown"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
