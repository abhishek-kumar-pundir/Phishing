import { useScanHistory } from "../hooks/useScanHistory";
import { HistoryTable } from "../components/history/HistoryTable";
import { EmptyState } from "../components/ui/EmptyState";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const { scans, loading, error, refresh } = useScanHistory();

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">History</h1>
          <p className="mt-1 text-sm text-mist-400">{scans.length} scan{scans.length === 1 ? "" : "s"} analyzed</p>
        </div>
        <button
          onClick={refresh}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist-300 hover:border-white/20 hover:text-mist-100"
        >
          Refresh
        </button>
      </div>

      {loading && <EmptyState title="Loading history…" />}
      {!loading && error && <EmptyState tone="danger" title="Couldn't load history" description={error} />}
      {!loading && !error && scans.length === 0 && (
        <EmptyState
          title="No scans yet"
          description="Run your first scan and it will show up here."
          action={
            <Link to="/scan" className="rounded-lg bg-signal-scan px-4 py-2 text-sm font-semibold text-white">
              Go to Scan
            </Link>
          }
        />
      )}
      {!loading && !error && scans.length > 0 && <HistoryTable scans={scans} />}
    </div>
  );
}
