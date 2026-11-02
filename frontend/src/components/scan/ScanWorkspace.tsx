import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Modality } from "../../api/phish360";
import { StepId, StepStatus } from "../../hooks/usePipelineScan";
import { UnifiedScanResult } from "../../lib/scanResult";
import { domainOf, durationLabel, pct } from "../../lib/format";
import { FusionScene3D } from "./fusion3d/FusionScene3D";
import { ModalityCardsGrid } from "./ModalityCardsGrid";
import { VerdictPanel } from "./VerdictPanel";
import { PipelineStages } from "./PipelineStages";
import { ReplayScrubber, REPLAY_STEPS } from "./ReplayScrubber";

interface Props {
  result: UnifiedScanResult;
  running?: boolean;
  stepOrder?: StepId[];
  stepStatus?: Record<StepId, StepStatus>;
  fetchInfo?: { statusCode: number; fetchDurationMs: number } | null;
  textWordCount?: number | null;
  visionInfo?: { backbone: string } | null;
  error?: string | null;
  isHistorical?: boolean;
}

const DEFAULT_STEPS: StepId[] = ["url", "fetch", "html", "text", "vision", "fusion"];

export function ScanWorkspace({
  result,
  running = false,
  stepOrder = DEFAULT_STEPS,
  stepStatus,
  fetchInfo,
  textWordCount,
  visionInfo,
  error = null,
  isHistorical = false,
}: Props) {
  const [selectedModality, setSelectedModality] = useState<Modality>("url");
  const [replayStepIndex, setReplayStepIndex] = useState<number>(REPLAY_STEPS.length - 1);

  // If live scan is currently running, keep replay scrubber at current stage
  const isFinished = !running && (result.fusion.probability != null || isHistorical);

  // Derive scrubbed / effective result based on replayStepIndex
  const effectiveResult = useMemo(() => {
    // If not in historical / replay inspection or already at final step, return real result
    if (!isFinished || replayStepIndex === REPLAY_STEPS.length - 1) {
      return result;
    }

    const currentStepId = REPLAY_STEPS[replayStepIndex].id;

    const partialScores: Partial<Record<Modality, number | null>> = {};
    const partialSkipReasons: Partial<Record<Modality, string>> = {};

    // Sliced scores according to scrubber stage
    if (replayStepIndex >= 0) {
      partialScores.url = result.scores.url;
      if (result.skipReasons.url) partialSkipReasons.url = result.skipReasons.url;
    }
    if (replayStepIndex >= 2) {
      partialScores.html = result.scores.html;
      if (result.skipReasons.html) partialSkipReasons.html = result.skipReasons.html;
    }
    if (replayStepIndex >= 3) {
      partialScores.text = result.scores.text;
      if (result.skipReasons.text) partialSkipReasons.text = result.skipReasons.text;
    }
    if (replayStepIndex >= 4) {
      partialScores.vision = result.scores.vision;
      if (result.skipReasons.vision) partialSkipReasons.vision = result.skipReasons.vision;
    }

    const fusionRevealed = replayStepIndex >= 5;

    return {
      ...result,
      scores: partialScores,
      skipReasons: partialSkipReasons,
      fusion: {
        ...result.fusion,
        probability: fusionRevealed ? result.fusion.probability : null,
        label: fusionRevealed ? result.fusion.label : null,
      },
    };
  }, [result, isFinished, replayStepIndex]);

  // Fallback step status if not provided (e.g. historical lookup)
  const effectiveStepStatus: Record<StepId, StepStatus> = useMemo(() => {
    if (stepStatus) return stepStatus;
    const res: Record<StepId, StepStatus> = {} as any;
    for (let i = 0; i < stepOrder.length; i++) {
      const step = stepOrder[i];
      if (isFinished) {
        res[step] = "done";
      } else {
        res[step] = i === 0 ? "active" : "pending";
      }
    }
    return res;
  }, [stepStatus, stepOrder, isFinished]);

  return (
    <div className="space-y-5 font-sans min-w-0">
      {/* Top Scan Context Bar */}
      <div className="border border-surface-border bg-surface-card rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest">
              {running ? "Live Investigation" : isHistorical ? "Historical Audit" : "Forensic Scan"}
            </span>
            {result.scanId != null && (
              <span className="font-mono text-[10px] text-mist-400 bg-surface-subtle px-1.5 py-0.5 rounded border border-surface-border">
                #{result.scanId}
              </span>
            )}
          </div>
          <h1 className="font-mono text-base sm:text-lg font-semibold text-mist-100 truncate max-w-xl">
            {domainOf(result.url) || result.url}
          </h1>
          <p className="font-mono text-xs text-mist-500 truncate max-w-2xl mt-0.5" title={result.url}>
            Target: {result.url}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {result.fusion.durationMs != null && (
            <div className="font-mono text-[11px] text-mist-400 tabular bg-surface-subtle px-2.5 py-1 rounded border border-surface-border">
              {durationLabel(result.fusion.durationMs)}
            </div>
          )}
          <Link
            to="/scan"
            className="px-3 py-1.5 rounded border border-surface-border bg-surface-subtle hover:bg-surface-canvas text-xs font-mono text-mist-300 hover:text-mist-100 transition-colors"
          >
            NEW SCAN
          </Link>
        </div>
      </div>

      {/* Main Forensic Grid: 60% Left (3D Pipeline), 40% Right (Inspector & Verdict) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start min-w-0">
        {/* Left Column: Functional 3D Pipeline Scene + Replay Scrubber (~58%) */}
        <div className="lg:col-span-7 space-y-4 min-w-0">
          {/* Functional 3D Pipeline Scene */}
          <FusionScene3D
            result={effectiveResult}
            running={running}
            selectedModality={selectedModality}
            onSelectModality={(m) => setSelectedModality(m)}
          />

          {/* Replay Scrubber for stepping through pipeline evidence */}
          {isFinished && (
            <ReplayScrubber
              currentStepIndex={replayStepIndex}
              onStepChange={(idx) => setReplayStepIndex(idx)}
            />
          )}
        </div>

        {/* Right Column: Timeline + Verdict Panel (~42%) */}
        <div className="lg:col-span-5 space-y-4 min-w-0">
          {/* Stage Execution Timeline */}
          <PipelineStages
            stepOrder={stepOrder}
            stepStatus={effectiveStepStatus}
            modalityScores={effectiveResult.scores}
            fetchInfo={fetchInfo ?? (effectiveResult.statusCode ? { statusCode: effectiveResult.statusCode, fetchDurationMs: effectiveResult.fetchDurationMs ?? 0 } : null)}
            textWordCount={textWordCount ?? effectiveResult.textPreview?.wordCount ?? null}
            visionInfo={visionInfo ?? effectiveResult.visionInfo ?? null}
            totalDurationMs={effectiveResult.fusion.durationMs}
            error={error}
          />

          {/* Verdict Panel (slides in after fusion event / when done) */}
          {effectiveResult.fusion.probability != null && (
            <VerdictPanel result={effectiveResult} />
          )}
        </div>
      </div>

      {/* 4 Different Boxes: 2 Rows & 2 Columns (URL, DOM, Text, Vision) */}
      <ModalityCardsGrid
        result={effectiveResult}
        selectedModality={selectedModality}
        onSelectModality={(m) => setSelectedModality(m)}
      />
    </div>
  );
}

