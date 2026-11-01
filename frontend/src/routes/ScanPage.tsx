import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScanContext } from "../context/ScanContext";
import { ScanWorkspace } from "../components/scan/ScanWorkspace";
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

  // True for the entire lifetime of "the scan this browser tab just ran"
  const isThisSessionsRun =
    scanId != null &&
    (scanId === liveId ||
      (pipeline.fusion?.scanId != null && String(pipeline.fusion.scanId) === scanId));

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
      explanations: pipeline.explanations,
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
        <ScanWorkspace
          result={liveResult}
          running={pipeline.phase === "running"}
          stepOrder={pipeline.stepOrder}
          stepStatus={pipeline.stepStatus}
          fetchInfo={pipeline.fetchInfo}
          textWordCount={pipeline.textWordCount}
          visionInfo={pipeline.visionInfo}
          error={pipeline.error}
        />

        {pipeline.phase === "error" && (
          <EmptyState
            tone="danger"
            title="Scan did not complete"
            description={pipeline.error ?? "A critical error occurred before a multimodal verdict could be produced."}
            action={
              <button
                onClick={() => navigate("/scan")}
                className="rounded px-4 py-2 font-mono text-xs font-semibold bg-brand text-surface-canvas hover:opacity-90 transition-opacity"
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
        title="Live scan session closed"
        description="Live scan state is not retained across page refreshes. Please start a new scan, or retrieve this result from the History tab."
        action={
          <button
            onClick={() => navigate("/scan")}
            className="rounded px-4 py-2 font-mono text-xs font-semibold bg-brand text-surface-canvas hover:opacity-90 transition-opacity"
          >
            Start a new scan
          </button>
        }
      />
    );
  }

  if (detail.loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-mist-500">
        Loading historical forensic audit #{scanId}…
      </div>
    );
  }

  if (detail.error || !detail.data) {
    return (
      <EmptyState
        tone="danger"
        title="Scan record not found"
        description={detail.error ?? `No forensic scan found with id #${scanId}.`}
        action={
          <button
            onClick={() => navigate("/history")}
            className="rounded px-4 py-2 font-mono text-xs font-semibold bg-brand text-surface-canvas hover:opacity-90 transition-opacity"
          >
            Go to history
          </button>
        }
      />
    );
  }

  return (
    <ScanWorkspace
      result={unifiedFromDetail(detail.data)}
      isHistorical={true}
    />
  );
}
