import { useState } from "react";
import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { FloatingWindow } from "../ui/FloatingWindow";
import { FeatureTable } from "../ui/FeatureTable";
import { SignalRows } from "../ui/SignalRow";
import { urlEvidence, htmlEvidence } from "../../lib/evidence";
import { pct, riskTone } from "../../lib/format";

const TITLES: Record<Modality, string> = {
  url: "URL model",
  html: "HTML / DOM model",
  text: "Text model",
  vision: "Vision model",
};

const TONE_TEXT: Record<string, string> = {
  safe: "text-signal-safeSoft",
  warn: "text-signal-warn",
  danger: "text-signal-dangerSoft",
  idle: "text-mist-300",
};

function ProbabilityHeader({ score }: { score: number | null | undefined }) {
  const tone = riskTone(score);
  return (
    <div>
      <p className={`tabular font-display text-[32px] font-bold leading-none ${TONE_TEXT[tone]}`}>{pct(score, 1)}</p>
      <p className="mt-1 text-[13px] text-mist-400">phishing probability</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0 py-4">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">{title}</p>
      {children}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-tight min-w-0 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wide text-mist-500">{label}</p>
      <p className="truncate text-sm text-mist-100">{value}</p>
    </div>
  );
}

function RawBlock({ content }: { content: string }) {
  return (
    <pre className="max-h-56 min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-surface-border bg-surface-subtle p-3 font-mono text-[11.5px] leading-relaxed text-mist-400">
      {content}
    </pre>
  );
}

export function ModalityWindow({
  modality,
  result,
  onClose,
}: {
  modality: Modality | null;
  result: UnifiedScanResult;
  onClose: () => void;
}) {
  const [lightbox, setLightbox] = useState(false);
  const score = modality ? result.scores[modality] : null;

  const handleClose = () => {
    setLightbox(false);
    onClose();
  };

  return (
    <>
      <FloatingWindow
        open={modality != null}
        onClose={handleClose}
        title={modality ? TITLES[modality] : ""}
        headerExtra={<ProbabilityHeader score={score} />}
      >
        {modality === "url" && result.urlFeatures && (
          <div className="min-w-0 divide-y divide-white/[0.06]">
            <Section title="Signals">
              <SignalRows signals={urlEvidence(result.urlFeatures)} />
            </Section>
            <Section title="Lexical statistics — all 24 features">
              <FeatureTable features={result.urlFeatures as unknown as Record<string, number>} />
            </Section>
            <Section title="Raw URL">
              <RawBlock content={result.url} />
            </Section>
          </div>
        )}

        {modality === "html" && result.htmlFeatures && (
          <div className="min-w-0 divide-y divide-white/[0.06]">
            <Section title="Structural signals">
              <SignalRows signals={htmlEvidence(result.htmlFeatures)} />
            </Section>
            <Section title="DOM statistics">
              <FeatureTable features={result.htmlFeatures as unknown as Record<string, number>} />
            </Section>
            {result.htmlPreview && (
              <Section title={`Raw HTML — ${result.htmlPreview.fullLength.toLocaleString()} chars total`}>
                <RawBlock content={result.htmlPreview.content} />
              </Section>
            )}
          </div>
        )}

        {modality === "text" && result.textPreview && (
          <div className="min-w-0 divide-y divide-white/[0.06]">
            <Section title="Model input">
              <div className="grid grid-cols-2 gap-2">
                <MiniStat label="Characters" value={result.textPreview.fullLength.toLocaleString()} />
                <MiniStat label="Words" value={(result.textPreview.wordCount ?? 0).toLocaleString()} />
              </div>
            </Section>
            {result.pageTitle && (
              <Section title="Title">
                <p className="text-sm text-mist-100">{result.pageTitle}</p>
              </Section>
            )}
            <Section title="Extracted text">
              <RawBlock content={result.textPreview.content} />
            </Section>
          </div>
        )}

        {modality === "vision" && (
          <div className="min-w-0 divide-y divide-white/[0.06]">
            {result.visionInfo && (
              <Section title="Model input">
                <div className="grid grid-cols-2 gap-2">
                  <MiniStat label="Embedding dim" value={String(result.visionInfo.embeddingDim)} />
                  <MiniStat label="Backbone" value={result.visionInfo.backbone} />
                </div>
              </Section>
            )}
            <Section title="Screenshot">
              {result.screenshotUrl ? (
                <div className="min-w-0">
                  <button
                    onClick={() => setLightbox(true)}
                    className="block w-full min-w-0 overflow-hidden rounded-lg border border-white/10"
                  >
                    <img src={result.screenshotUrl} alt="Page screenshot" className="block h-auto w-full max-w-full" />
                  </button>
                  <button onClick={() => setLightbox(true)} className="mt-2 text-xs text-signal-scanSoft hover:underline">
                    View larger
                  </button>
                </div>
              ) : (
                <p className="text-sm text-mist-500">No screenshot stored for this scan.</p>
              )}
            </Section>
          </div>
        )}
      </FloatingWindow>

      {lightbox && modality === "vision" && result.screenshotUrl && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-surface-canvas/90 p-6"
          onClick={() => setLightbox(false)}
        >
          <img
            src={result.screenshotUrl}
            alt="Page screenshot (enlarged)"
            className="max-h-full max-w-full rounded-lg border border-white/10 object-contain"
          />
        </div>
      )}
    </>
  );
}
