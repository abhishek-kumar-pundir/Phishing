import { Link } from "react-router-dom";
import { useScanHistory } from "../hooks/useScanHistory";
import { HistoryTable } from "../components/history/HistoryTable";
import { EmptyState } from "../components/ui/EmptyState";

export default function HistoryPage() {
  const { scans, loading, error, refresh } = useScanHistory();

  return (
    <div className="min-w-0 space-y-5 font-sans">
      {/* Header */}
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest block mb-1">
            Historical Audit Logs
          </span>
          <h1 className="font-mono text-lg font-semibold text-mist-100">
            Forensic Investigation Archive
          </h1>
          <p className="text-xs text-mist-400 mt-0.5">
            Complete database of persisted scans with per-modality probabilities and review band markers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-mist-400 tabular bg-surface-subtle px-2.5 py-1 rounded border border-surface-border">
            {scans.length} {scans.length === 1 ? "Record" : "Records"}
          </span>
          <button
            onClick={refresh}
            className="px-3 py-1.5 rounded border border-surface-border bg-surface-subtle hover:bg-surface-canvas text-xs font-mono text-mist-300 hover:text-mist-100 transition-colors"
          >
            REFRESH
          </button>
        </div>
      </div>

      {loading && (
        <div className="p-12 text-center font-mono text-xs text-mist-500">
          Loading historical scan records…
        </div>
      )}

      {!loading && error && (
        <EmptyState
          tone="danger"
          title="Unable to load history"
          description={error}
        />
      )}

      {!loading && !error && scans.length === 0 && (
        <EmptyState
          title="No scan records found"
          description="Initiate your first investigation from the console to populate historical logs."
          action={
            <Link
              to="/scan"
              className="px-4 py-2 font-mono text-xs font-semibold rounded bg-brand text-surface-canvas hover:opacity-90 transition-opacity"
            >
              Start First Scan
            </Link>
          }
        />
      )}

      {!loading && !error && scans.length > 0 && <HistoryTable scans={scans} />}
    </div>
  );
}
