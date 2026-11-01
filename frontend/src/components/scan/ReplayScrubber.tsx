import React, { useEffect, useState } from "react";
import { StepId } from "../../hooks/usePipelineScan";

export const REPLAY_STEPS: { id: StepId | "done"; label: string }[] = [
  { id: "url", label: "URL Analysis" },
  { id: "fetch", label: "Page Retrieval" },
  { id: "html", label: "DOM Evaluation" },
  { id: "text", label: "Text Extraction" },
  { id: "vision", label: "Visual Processing" },
  { id: "fusion", label: "Multimodal Fusion" },
  { id: "done", label: "Verdict Resolved" },
];

interface Props {
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  maxStepIndex?: number;
}

export function ReplayScrubber({
  currentStepIndex,
  onStepChange,
  maxStepIndex = REPLAY_STEPS.length - 1,
}: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      onStepChange(
        currentStepIndex < maxStepIndex ? currentStepIndex + 1 : 0
      );
    }, 1200);
    return () => clearInterval(timer);
  }, [isPlaying, currentStepIndex, maxStepIndex, onStepChange]);

  const handleStepBack = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) onStepChange(currentStepIndex - 1);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (currentStepIndex < maxStepIndex) onStepChange(currentStepIndex + 1);
  };

  const togglePlay = () => {
    if (currentStepIndex >= maxStepIndex && !isPlaying) {
      onStepChange(0);
    }
    setIsPlaying((p) => !p);
  };

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg p-3 space-y-3 font-sans">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-mist-500 uppercase tracking-wider">
            Replay Pipeline
          </span>
          <span className="font-mono text-[11px] text-brand font-medium">
            Stage {currentStepIndex + 1}/{maxStepIndex + 1}: {REPLAY_STEPS[currentStepIndex].label}
          </span>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <button
            type="button"
            onClick={handleStepBack}
            disabled={currentStepIndex === 0}
            className="p-1 px-2 rounded border border-surface-border bg-surface-subtle text-mist-300 hover:text-mist-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Step Back"
          >
            ←
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="px-2.5 py-1 rounded border border-surface-border bg-surface-subtle text-mist-100 font-semibold hover:border-brand/40 transition-colors"
          >
            {isPlaying ? "PAUSE" : "REPLAY"}
          </button>
          <button
            type="button"
            onClick={handleStepForward}
            disabled={currentStepIndex >= maxStepIndex}
            className="p-1 px-2 rounded border border-surface-border bg-surface-subtle text-mist-300 hover:text-mist-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            title="Step Forward"
          >
            →
          </button>
        </div>
      </div>

      {/* Scrubber Bar with Step Notches */}
      <div className="relative flex items-center pt-1 pb-1">
        <div className="absolute left-0 right-0 h-1 bg-surface-subtle rounded-full" />
        <div
          className="absolute left-0 h-1 bg-brand rounded-full transition-all duration-300"
          style={{ width: `${(currentStepIndex / maxStepIndex) * 100}%` }}
        />

        <div className="relative w-full flex justify-between items-center z-10">
          {REPLAY_STEPS.slice(0, maxStepIndex + 1).map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  onStepChange(idx);
                }}
                className={`group flex flex-col items-center focus:outline-none transition-transform ${
                  isCurrent ? "scale-125" : "hover:scale-110"
                }`}
                title={step.label}
              >
                <span
                  className={`w-3 h-3 rounded-full border transition-colors ${
                    isCurrent
                      ? "bg-brand border-brand ring-2 ring-brand/30"
                      : isCompleted
                      ? "bg-brand border-brand"
                      : "bg-surface-card border-surface-border"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

