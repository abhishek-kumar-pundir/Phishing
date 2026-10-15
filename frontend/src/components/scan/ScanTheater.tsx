import { Modality } from "../../api/phish360";
import { StepId, StepStatus } from "../../hooks/usePipelineScan";
import { UnifiedScanResult } from "../../lib/scanResult";
import { domainOf, durationLabel, pct } from "../../lib/format";
import { PipelineStages } from "./PipelineStages";
import { FusionScene3DLazy } from "./fusion3d/FusionScene3DLazy";

interface Props {
  result: UnifiedScanResult;
  running: boolean;
  stepOrder: StepId[];
  stepStatus: Record<StepId, StepStatus>;
  modalityScores: Partial<Record<Modality, number | null>>;
  fetchInfo: { statusCode: number; fetchDurationMs: number } | null;
  textWordCount: number | null;
  visionInfo: { backbone: string } | null;
  error: string | null;
}

export function ScanTheater({
  result,
  running,
  stepOrder,
  stepStatus,
  modalityScores,
  fetchInfo,
  textWordCount,
  visionInfo,
  error,
}: Props) {
  const revealed = result.fusion.probability != null && result.fusion.label != null;

  return (
    <div className="surface relative min-w-0 overflow-hidden px-4 py-6 sm:px-6 sm:py-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 faint-grid-bg opacity-50" />

      <div className="relative min-w-0">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">
              {running ? "Live investigation" : "Investigation"}
            </p>
            <h1 className="mt-1 truncate font-display text-lg font-semibold text-mist-100 sm:text-xl">
              {domainOf(result.url) || "…"}
            </h1>
          </div>
          {revealed && (
            <span className="text-xs text-mist-500">
              {durationLabel(result.fusion.durationMs)} scan · threshold {pct(result.fusion.threshold, 0)}
            </span>
          )}
        </div>

        <PipelineStages
          embedded
          stepOrder={stepOrder}
          stepStatus={stepStatus}
          modalityScores={modalityScores}
          fetchInfo={fetchInfo}
          textWordCount={textWordCount}
          visionInfo={visionInfo}
          error={error}
        />

        <div className="mt-6 min-w-0">
          <FusionScene3DLazy result={result} running={running} />
        </div>
      </div>
    </div>
  );
}
