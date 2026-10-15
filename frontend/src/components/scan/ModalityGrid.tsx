import { useState } from "react";
import { motion } from "framer-motion";
import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";
import { Signal, urlEvidence, htmlEvidence } from "../../lib/evidence";
import { ModalityWindow } from "./ModalityWindow";

const MODALITY_META: Record<Modality, { label: string }> = {
  url: { label: "URL" },
  html: { label: "HTML / DOM" },
  text: { label: "Text" },
  vision: { label: "Vision" },
};

const TONE_CLASSES: Record<string, { border: string; text: string; bar: string }> = {
  safe: { border: "border-signal-safe/25", text: "text-signal-safeSoft", bar: "bg-signal-safe" },
  warn: { border: "border-signal-warn/25", text: "text-signal-warn", bar: "bg-signal-warn" },
  danger: { border: "border-signal-danger/25", text: "text-signal-dangerSoft", bar: "bg-signal-danger" },
  idle: { border: "border-white/10", text: "text-mist-500", bar: "bg-mist-600" },
};

function keySignals(modality: Modality, result: UnifiedScanResult): Signal[] {
  if (modality === "url" && result.urlFeatures) return urlEvidence(result.urlFeatures).slice(0, 3);
  if (modality === "html" && result.htmlFeatures) return htmlEvidence(result.htmlFeatures).slice(0, 3);
  if (modality === "text" && result.textPreview) {
    return [
      { text: `${result.textPreview.wordCount ?? "—"} words extracted`, tone: "neutral" },
      { text: `${result.textPreview.fullLength} characters`, tone: "neutral" },
    ];
  }
  if (modality === "vision" && result.visionInfo) {
    return [
      { text: `${result.visionInfo.embeddingDim}-dim embedding`, tone: "neutral" },
      { text: `backbone: ${result.visionInfo.backbone}`, tone: "neutral" },
    ];
  }
  return [];
}

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

export function ModalityGrid({ result }: { result: UnifiedScanResult }) {
  const [open, setOpen] = useState<Modality | null>(null);
  const modalities: Modality[] = ["url", "html", "text", "vision"];

  return (
    <>
      <motion.div
        variants={gridVariants}
        initial="hidden"
        animate="show"
        className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {modalities.map((m) => {
          const score = result.scores[m];
          const skip = result.skipReasons[m];
          const tone = TONE_CLASSES[riskTone(score)];
          const signals = keySignals(m, result);

          return (
            <motion.button
              key={m}
              variants={cardVariants}
              onClick={() => score != null && setOpen(m)}
              disabled={score == null}
              whileHover={score != null ? { y: -3 } : undefined}
              whileTap={score != null ? { scale: 0.985 } : undefined}
              className={`surface-tight min-w-0 border px-4 py-4 text-left transition-shadow ${tone.border} ${
                score != null ? "cursor-pointer hover:shadow-glass" : "cursor-not-allowed opacity-60"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-mist-400">{MODALITY_META[m].label}</p>
                {score != null && (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-mist-500" fill="none">
                    <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>

              {score != null ? (
                <>
                  <p className={`tabular mt-1 font-display text-3xl font-semibold ${tone.text}`}>{pct(score, 0)}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
                    <div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${Math.min(100, score * 100)}%` }} />
                  </div>
                  <div className="mt-3 space-y-1">
                    {signals.map((s, i) => (
                      <p key={i} className="truncate text-[11px] text-mist-500">
                        {s.text}
                      </p>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-2 text-xs text-mist-500">{skip ?? "Not available"}</p>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      <ModalityWindow modality={open} result={result} onClose={() => setOpen(null)} />
    </>
  );
}
