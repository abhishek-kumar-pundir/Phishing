import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScanContext } from "../context/ScanContext";
import { ScanTheater } from "../components/scan/ScanTheater";
import { ScanResultView } from "../components/scan/ScanResultView";
import { EmptyState } from "../components/ui/EmptyState";
import { useScanDetail } from "../hooks/useScanDetail";
import { unifiedFromDetail, unifiedFromLive } from "../lib/scanResult";

function isLiveId(id: string): boolean {
  return id.startsWith("live-");
}

export default function ScanPage() {
  const { scanId } = useParams<{ scanId: string }>();
  const { pipeline, liveId, screenshotObjectUrl, clientHtml } = useScanContext();
  const navigate = useNavigate();

  // True for the entire lifetime of "the scan this browser tab just ran" --
  // true while it's running under /scan/live-xxx, and STILL true after we
  // silently swap the URL to /scan/<persisted id> once it finishes. That's
  // the fix: we never fall through to a fetch+loading-spinner render for
  // data we already have in memory, so nothing flickers or jumps.
  const isThisSessionsRun =
    scanId != null && (scanId === liveId || (pipeline.fusion?.scanId != null && String(pipeline.fusion.scanId) === scanId));

  useEffect(() => {
    if (scanId === liveId && pipeline.phase === "done" && pipeline.fusion?.scanId != null) {
      navigate(`/scan/${pipeline.fusion.scanId}`, { replace: true });
    }
  }, [scanId, liveId, pipeline.phase, pipeline.fusion?.scanId, navigate]);

  const numericId = scanId && !isLiveId(scanId) && !isThisSessionsRun ? scanId : null;
  const detail = useScanDetail(numericId);

  if (isThisSessionsRun) {
    const liveResult = unifiedFromLive({
      scannedUrl: pipeline.scannedUrl,
      modalityScores: pipeline.modalityScores,
      modalitySkipReason: pipeline.modalitySkipReason,
      fusion: pipeline.fusion,
      urlFeatures: pipeline.urlFeatures,
      htmlFeatures: pipeline.htmlFeatures,
      fetchInfo: pipeline.fetchInfo,
      fetchedHtml: pipeline.fetchedHtml,
      extractedText: pipeline.extractedText,
      textWordCount: pipeline.textWordCount,
      visionInfo: pipeline.visionInfo,
      clientHtml,
      screenshotObjectUrl,
    });

    return (
      <div className="min-w-0 space-y-6">
        <ScanTheater
          result={liveResult}
          running={pipeline.phase === "running"}
          stepOrder={pipeline.stepOrder}
          stepStatus={pipeline.stepStatus}
          modalityScores={pipeline.modalityScores}
          fetchInfo={pipeline.fetchInfo}
          textWordCount={pipeline.textWordCount}
          visionInfo={pipeline.visionInfo}
          error={pipeline.error}
        />

        {pipeline.phase === "done" && (
          <ScanResultView result={liveResult} hideFusionScene revealDelayMs={750} />
        )}

        {pipeline.phase === "error" && (
          <EmptyState
            tone="danger"
            title="Scan didn't complete"
            description={pipeline.error ?? "Something went wrong before a verdict could be produced."}
            action={
              <button
                onClick={() => navigate("/scan")}
                className="rounded-lg bg-signal-scan px-4 py-2 text-sm font-semibold text-white"
              >
                Start a new scan
              </button>
            }
          />
        )}
      </div>
    );
  }

  if (scanId && isLiveId(scanId)) {
    return (
      <EmptyState
        title="This live scan session has ended"
        description="Live scan progress isn't kept after a page refresh. Start a new scan, or find this scan in your history if it finished."
        action={
          <button onClick={() => navigate("/scan")} className="rounded-lg bg-signal-scan px-4 py-2 text-sm font-semibold text-white">
            Start a new scan
          </button>
        }
      />
    );
  }

  if (detail.loading) return <EmptyState title="Loading scan…" />;
  if (detail.error || !detail.data) {
    return (
      <EmptyState
        tone="danger"
        title="Scan not found"
        description={detail.error ?? `No scan with id ${scanId}.`}
        action={
          <button onClick={() => navigate("/history")} className="rounded-lg bg-signal-scan px-4 py-2 text-sm font-semibold text-white">
            Go to history
          </button>
        }
      />
    );
  }

  return <ScanResultView result={unifiedFromDetail(detail.data)} />;
}
