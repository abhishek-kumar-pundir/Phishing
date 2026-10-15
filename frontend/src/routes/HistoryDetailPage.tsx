import { Link, useParams } from "react-router-dom";
import { useScanDetail } from "../hooks/useScanDetail";
import { unifiedFromDetail } from "../lib/scanResult";
import { ScanResultView } from "../components/scan/ScanResultView";
import { EmptyState } from "../components/ui/EmptyState";

export default function HistoryDetailPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const detail = useScanDetail(scanId);

  if (detail.loading) return <EmptyState title="Loading scan…" />;
  if (detail.error || !detail.data) {
    return (
      <EmptyState
        tone="danger"
        title="Scan not found"
        description={detail.error ?? `No scan with id ${scanId}.`}
        action={
          <Link to="/history" className="rounded-lg bg-signal-scan px-4 py-2 text-sm font-semibold text-white">
            Back to history
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-w-0 space-y-5">
      <Link to="/history" className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-mist-100">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to history
      </Link>
      <ScanResultView result={unifiedFromDetail(detail.data)} />
    </div>
  );
}
