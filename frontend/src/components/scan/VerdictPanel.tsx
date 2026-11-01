import React from "react";
import { motion } from "framer-motion";
import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";
import { TONE_HEX } from "../../lib/tone";

interface Props {
  result: UnifiedScanResult;
}

const MODALITY_WEIGHTS: Record<Modality, number> = {
  url: 3.5985,
  html: 2.6307,
  text: 4.9169,
  vision: 1.2024,
};

const TOTAL_WEIGHT = 3.5985 + 2.6307 + 4.9169 + 1.2024; // 12.3485

export function VerdictPanel({ result }: Props) {
  const { fusion } = result;
  const isDone = fusion.probability != null && fusion.label != null;
  if (!isDone) return null;

  const isPhishing = fusion.label === "phishing";
  const probability = fusion.probability!;
  const tone = isPhishing ? "danger" : "safe";
  const headlineColor = isPhishing ? "text-verdict-phish" : "text-verdict-legit";

  // Operating point label
  const operatingPointName = fusion.operatingPoint ?? "balanced";
  const formattedOpName = operatingPointName.replace(/_/g, " ").toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="border border-surface-border bg-surface-card rounded-lg p-5 space-y-5"
    >
      {/* Top Header: Serif Headline & Operating Point Badge */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-surface-border pb-4">
        <div>
          <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest block mb-1">
            Multimodal Fusion Verdict
          </span>
          <h2 className={`font-serif text-3xl font-normal tracking-tight ${headlineColor}`}>
            {isPhishing ? "Phishing Threat Detected" : "Legitimate Entity Verified"}
          </h2>
        </div>

        {/* Operating Point Indicator */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded border border-surface-border bg-surface-subtle font-mono text-[11px] text-mist-300">
            <span className="text-mist-500 mr-1.5">OPERATING POINT:</span>
            <span className="font-semibold text-mist-100">{formattedOpName}</span>
            <span className="text-mist-500 ml-1">({fusion.threshold.toFixed(2)})</span>
          </div>
        </div>
      </div>

      {/* Main Metric Row: Serif/Mono Large Number + Needs Review Callout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <div>
          <span className="font-mono text-[11px] text-mist-500 uppercase tracking-wider block">
            Calibrated Phishing Confidence
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-serif text-5xl font-normal tabular text-mist-100">
              {pct(probability, 1)}
            </span>
            <span className="font-mono text-xs text-mist-500">
              ({probability.toFixed(4)})
            </span>
          </div>
        </div>

        {/* Needs Review Amber State */}
        {fusion.needsReview && (
          <div className="border border-verdict-warn/40 bg-verdict-warn/10 rounded p-3 text-xs font-mono space-y-1">
            <div className="flex items-center gap-1.5 text-verdict-warn font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-verdict-warn animate-pulse" />
              <span>MANUAL REVIEW RECOMMENDED</span>
            </div>
            <p className="text-[11px] text-mist-400 font-sans leading-relaxed">
              Fused score falls within the designated review band{" "}
              <span className="font-mono text-mist-200">
                [{fusion.reviewBand?.low.toFixed(2)} - {fusion.reviewBand?.high.toFixed(2)}]
              </span>
              . High-uncertainty boundary region.
            </p>
          </div>
        )}
      </div>

      {/* Per-Modality Contribution Bars (weight x probability) */}
      <div className="border-t border-surface-border pt-4 space-y-2.5">
        <div className="flex justify-between items-baseline text-[11px] font-mono text-mist-400">
          <span className="uppercase tracking-wider">Per-Modality Linear Contributions</span>
          <span className="text-mist-500">LogReg Weight × Probability</span>
        </div>

        <div className="space-y-2">
          {(["url", "html", "text", "vision"] as Modality[]).map((m) => {
            const score = result.scores[m];
            const weight = MODALITY_WEIGHTS[m];
            const weightPct = ((weight / TOTAL_WEIGHT) * 100).toFixed(1);
            const contribution = score != null ? weight * score : 0;
            const scoreTone = riskTone(score);

            return (
              <div key={m} className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-mist-300 uppercase">
                    {m === "html" ? "DOM" : m} <span className="text-mist-500">({weightPct}% weight)</span>
                  </span>
                  <div className="flex items-center gap-3 tabular">
                    <span className="text-mist-500">
                      score: {score != null ? pct(score, 0) : "—"}
                    </span>
                    <span className="text-mist-200 font-medium w-14 text-right">
                      {score != null ? `+${contribution.toFixed(2)}` : "0.00"}
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden flex">
                  {score != null ? (
                    <div
                      className="h-full rounded-full bg-brand/80 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(2, score * 100))}%`,
                      }}
                    />
                  ) : (
                    <div className="h-full w-full bg-surface-border" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

