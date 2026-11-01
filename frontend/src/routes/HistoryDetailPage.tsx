import { Link, useParams } from "react-router-dom";
import { useScanDetail } from "../hooks/useScanDetail";
import { unifiedFromDetail } from "../lib/scanResult";
import { ScanWorkspace } from "../components/scan/ScanWorkspace";
import { EmptyState } from "../components/ui/EmptyState";
import { ArrowLeft } from "../components/ui/Glyphs";

export default function HistoryDetailPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const detail = useScanDetail(scanId);

  if (detail.loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-mist-500">
        Loading historical scan audit #{scanId}…
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <EmptyState
        tone="danger"
        title="Scan record not found"
        description={detail.error ?? `No scan record found with id #${scanId}.`}
        action={
          <Link
            to="/history"
            className="rounded px-4 py-2 font-mono text-xs font-semibold bg-brand text-surface-canvas hover:opacity-90 transition-opacity"
          >
            Back to history
          </Link>
        }
      />
    );
  }

  return (
    <div className="min-w-0 space-y-4 font-sans">
      <Link
        to="/history"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-mist-400 hover:text-mist-100 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to history
      </Link>
      <ScanWorkspace result={unifiedFromDetail(detail.data)} isHistorical={true} />
    </div>
  );
}
