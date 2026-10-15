import { Modality } from "../../api/phish360";
import { StepId, StepStatus, STEP_LABELS } from "../../hooks/usePipelineScan";
import { pct } from "../../lib/format";

interface Props {
  stepOrder: StepId[];
  stepStatus: Record<StepId, StepStatus>;
  modalityScores: Partial<Record<Modality, number | null>>;
  fetchInfo: { statusCode: number; fetchDurationMs: number } | null;
  textWordCount: number | null;
  visionInfo: { backbone: string } | null;
  error: string | null;
  embedded?: boolean;
}

const MODALITY_OF: Partial<Record<StepId, Modality>> = { url: "url", html: "html", text: "text", vision: "vision" };

function StatusDot({ status }: { status: StepStatus }) {
  if (status === "active")
    return <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal-scan opacity-60" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-signal-scan" /></span>;
  if (status === "done") return <span className="inline-flex h-2.5 w-2.5 items-center justify-center rounded-full bg-signal-safe" />;
  if (status === "skipped") return <span className="inline-flex h-2.5 w-2.5 rounded-full border border-mist-600 bg-transparent" />;
  if (status === "error") return <span className="inline-flex h-2.5 w-2.5 rounded-full bg-signal-danger" />;
  return <span className="inline-flex h-2.5 w-2.5 rounded-full border border-white/15 bg-transparent" />;
}

function summaryFor(
  step: StepId,
  status: StepStatus,
  modalityScores: Props["modalityScores"],
  fetchInfo: Props["fetchInfo"],
  textWordCount: number | null,
  visionInfo: Props["visionInfo"]
): string {
  if (status === "pending") return "Waiting";
  if (status === "active") return "Running…";
  if (status === "skipped") return "Skipped";
  if (status === "error") return "Failed";

  const modality = MODALITY_OF[step];
  if (modality) {
    const score = modalityScores[modality];
    return score != null ? `${pct(score, 0)} risk` : "No score";
  }
  if (step === "fetch") {
    return fetchInfo ? `HTTP ${fetchInfo.statusCode} · ${(fetchInfo.fetchDurationMs / 1000).toFixed(1)}s` : "Fetched";
  }
  if (step === "fusion") return "Verdict ready";
  return "Done";
}

export function PipelineStages({
  stepOrder,
  stepStatus,
  modalityScores,
  fetchInfo,
  textWordCount,
  visionInfo,
  error,
  embedded = false,
}: Props) {
  return (
    <div className={embedded ? "min-w-0" : "surface min-w-0 px-4 py-6 sm:px-6"}>
      {!embedded && <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Live investigation</p>}

      {/* Mobile: vertical list */}
      <div className="flex flex-col gap-0 lg:hidden">
        {stepOrder.map((step, i) => {
          const status = stepStatus[step] ?? "pending";
          return (
            <div key={step} className="flex gap-3">
              <div className="flex flex-col items-center">
                <StatusDot status={status} />
                {i < stepOrder.length - 1 && (
                  <span className={`mt-1 w-px flex-1 ${status === "done" ? "bg-signal-safe/40" : "bg-white/10"}`} style={{ minHeight: 28 }} />
                )}
              </div>
              <div className="min-w-0 pb-5">
                <p className={`text-sm font-medium ${status === "active" ? "text-mist-100" : "text-mist-200"}`}>
                  {STEP_LABELS[step]}
                </p>
                <p className="text-xs text-mist-500">
                  {summaryFor(step, status, modalityScores, fetchInfo, textWordCount, visionInfo)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: horizontal pipeline */}
      <div className="hidden min-w-0 items-start lg:flex">
        {stepOrder.map((step, i) => {
          const status = stepStatus[step] ?? "pending";
          return (
            <div key={step} className="flex min-w-0 flex-1 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
                    status === "active"
                      ? "border-signal-scan bg-signal-scan/15"
                      : status === "done"
                      ? "border-signal-safe/50 bg-signal-safe/10"
                      : status === "error"
                      ? "border-signal-danger/50 bg-signal-danger/10"
                      : "border-white/15 bg-white/[0.02]"
                  }`}
                >
                  <StatusDot status={status} />
                </div>
                <p className={`mt-2.5 max-w-[9rem] truncate text-xs font-medium ${status === "active" ? "text-mist-100" : "text-mist-300"}`}>
                  {STEP_LABELS[step]}
                </p>
                <p className="mt-0.5 text-[11px] text-mist-500">
                  {summaryFor(step, status, modalityScores, fetchInfo, textWordCount, visionInfo)}
                </p>
              </div>
              {i < stepOrder.length - 1 && (
                <div className={`mt-4 h-px flex-1 ${status === "done" ? "bg-signal-safe/40" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-signal-danger/30 bg-signal-danger/[0.06] px-4 py-3 text-sm text-signal-dangerSoft">
          {error}
        </div>
      )}
    </div>
  );
}
