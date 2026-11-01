import React from "react";
import { Modality } from "../../api/phish360";
import { StepId, StepStatus, STEP_LABELS } from "../../hooks/usePipelineScan";
import { pct } from "../../lib/format";
import {
  StatusDone,
  StatusError,
  StatusPending,
  StatusRunning,
  StatusSkipped,
} from "../ui/Glyphs";

interface Props {
  stepOrder: StepId[];
  stepStatus: Record<StepId, StepStatus>;
  modalityScores: Partial<Record<Modality, number | null>>;
  fetchInfo: { statusCode: number; fetchDurationMs: number } | null;
  textWordCount: number | null;
  visionInfo: { backbone: string } | null;
  totalDurationMs?: number | null;
  error: string | null;
  embedded?: boolean;
}

const MODALITY_OF: Partial<Record<StepId, Modality>> = {
  url: "url",
  html: "html",
  text: "text",
  vision: "vision",
};

function StageGlyph({ status }: { status: StepStatus }) {
  switch (status) {
    case "active":
      return <StatusRunning size={18} className="text-brand animate-pulse" />;
    case "done":
      return <StatusDone size={18} className="text-verdict-legit" />;
    case "skipped":
      return <StatusSkipped size={18} className="text-mist-500" />;
    case "error":
      return <StatusError size={18} className="text-verdict-phish" />;
    default:
      return <StatusPending size={18} className="text-mist-600" />;
  }
}

function summaryFor(
  step: StepId,
  status: StepStatus,
  modalityScores: Props["modalityScores"],
  fetchInfo: Props["fetchInfo"],
  textWordCount: number | null,
  visionInfo: Props["visionInfo"],
  totalDurationMs?: number | null
): string {
  if (status === "pending") return "Pending";
  if (status === "active") return "Evaluating…";
  if (status === "skipped") return "Skipped";
  if (status === "error") return "Failed";

  const modality = MODALITY_OF[step];
  if (modality) {
    const score = modalityScores[modality];
    return score != null ? `${pct(score, 1)} risk` : "No score";
  }
  if (step === "fetch") {
    return fetchInfo
      ? `HTTP ${fetchInfo.statusCode} · ${fetchInfo.fetchDurationMs}ms`
      : "Fetched";
  }
  if (step === "fusion") {
    return totalDurationMs != null ? `Fused in ${totalDurationMs}ms` : "Verdict ready";
  }
  return "Completed";
}

export function PipelineStages({
  stepOrder,
  stepStatus,
  modalityScores,
  fetchInfo,
  textWordCount,
  visionInfo,
  totalDurationMs,
  error,
  embedded = false,
}: Props) {
  return (
    <div
      className={
        embedded
          ? "min-w-0"
          : "border border-surface-border bg-surface-card rounded-lg p-4 min-w-0 font-sans"
      }
    >
      <div className="flex items-center justify-between mb-3 border-b border-surface-border pb-2">
        <span className="font-mono text-[10px] text-mist-500 uppercase tracking-wider">
          Stage Execution Timeline
        </span>
        {totalDurationMs != null && (
          <span className="font-mono text-[11px] text-mist-400 tabular">
            Total: {totalDurationMs}ms
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {stepOrder.map((step) => {
          const status = stepStatus[step] ?? "pending";
          const isActive = status === "active";
          const isDone = status === "done";

          return (
            <div
              key={step}
              className={`p-2.5 rounded border transition-colors flex flex-col justify-between ${
                isActive
                  ? "border-brand/40 bg-brand/5"
                  : isDone
                  ? "border-surface-border bg-surface-subtle/40"
                  : "border-surface-border/50 bg-surface-canvas/40"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[10px] uppercase text-mist-400 font-semibold tracking-wider">
                  {step}
                </span>
                <StageGlyph status={status} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-medium text-mist-200 truncate">
                  {STEP_LABELS[step]}
                </p>
                <p className="text-[10px] font-mono text-mist-500 truncate mt-0.5 tabular">
                  {summaryFor(
                    step,
                    status,
                    modalityScores,
                    fetchInfo,
                    textWordCount,
                    visionInfo,
                    totalDurationMs
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-3 border border-verdict-phish/40 bg-verdict-phish/10 rounded p-3 text-xs font-mono text-verdict-phish">
          {error}
        </div>
      )}
    </div>
  );
}
