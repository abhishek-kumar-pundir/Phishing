import React from "react";
import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";
import { TONE_HEX } from "../../lib/tone";
import { DomGlyph, TextGlyph, UrlGlyph, VisionGlyph } from "../ui/Glyphs";

interface Props {
  result: UnifiedScanResult;
  selectedModality: Modality;
  onSelectModality: (m: Modality) => void;
}

const MODALITY_CONFIG: Record<
  Modality,
  { label: string; glyph: React.FC<{ size?: number; className?: string }> }
> = {
  url: { label: "URL", glyph: UrlGlyph },
  html: { label: "DOM", glyph: DomGlyph },
  text: { label: "TEXT", glyph: TextGlyph },
  vision: { label: "VISION", glyph: VisionGlyph },
};

export function DockedInspector({ result, selectedModality, onSelectModality }: Props) {
  const currentScore = result.scores[selectedModality];
  const skipReason = result.skipReasons[selectedModality];
  const scoreTone = riskTone(currentScore);

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg flex flex-col h-full min-h-[460px] overflow-hidden text-mist-100 font-sans">
      {/* Modality Selector Bar */}
      <div className="flex items-center border-b border-surface-border bg-surface-subtle/50 px-2 py-1.5 overflow-x-auto">
        {(["url", "html", "text", "vision"] as Modality[]).map((m) => {
          const cfg = MODALITY_CONFIG[m];
          const Glyph = cfg.glyph;
          const score = result.scores[m];
          const isSelected = selectedModality === m;
          const tone = riskTone(score);

          return (
            <button
              key={m}
              type="button"
              onClick={() => onSelectModality(m)}
              className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition-colors shrink-0 ${
                isSelected
                  ? "bg-surface-card text-mist-100 font-medium border border-surface-border"
                  : "text-mist-400 hover:text-mist-200 hover:bg-surface-subtle"
              }`}
            >
              <Glyph
                size={16}
                className={isSelected ? "text-brand" : "text-mist-500"}
              />
              <span className="font-mono">{cfg.label}</span>
              {score != null ? (
                <span className="font-mono text-[10px] tabular px-1.5 py-0.5 rounded border border-surface-border text-mist-300">
                  {pct(score, 0)}
                </span>
              ) : (
                <span className="font-mono text-[10px] text-mist-600">
                  {result.skipReasons[m] ? "SKIP" : "—"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modality Inspector Header */}
      <div className="p-4 border-b border-surface-border flex items-center justify-between gap-4 bg-surface-subtle/20">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-1.5 h-1.5 rounded-full bg-brand" />
          <div>
            <h3 className="font-mono text-xs font-semibold tracking-wider text-mist-100 uppercase">
              {MODALITY_CONFIG[selectedModality].label} FORENSIC INSPECTOR
            </h3>
            <p className="text-[11px] font-mono text-mist-500">
              {currentScore != null
                ? `Probability: ${pct(currentScore, 1)}`
                : skipReason
                ? `Skipped: ${skipReason}`
                : "Awaiting analysis"}
            </p>
          </div>
        </div>

        {currentScore != null && (
          <div className="text-right">
            <span className="font-mono text-xl font-bold tabular text-mist-100">
              {pct(currentScore, 1)}
            </span>
            <span className="block text-[10px] font-mono text-mist-500 uppercase">Risk score</span>
          </div>
        )}
      </div>

      {/* Modality Forensic Content Area */}
      <div className="flex-1 p-4 overflow-y-auto min-w-0 space-y-4 text-xs">
        {selectedModality === "url" && (
          <UrlForensics result={result} />
        )}
        {selectedModality === "html" && (
          <HtmlForensics result={result} />
        )}
        {selectedModality === "text" && (
          <TextForensics result={result} />
        )}
        {selectedModality === "vision" && (
          <VisionForensics result={result} />
        )}
      </div>
    </div>
  );
}

// --- URL FORENSICS (TreeSHAP) --------------------------------------------

function UrlForensics({ result }: { result: UnifiedScanResult }) {
  const urlExplanations = result.explanations?.url;
  const topFeatures = urlExplanations?.top_features ?? [];
  const maxAbsShap = Math.max(
    0.01,
    ...topFeatures.map((f) => Math.abs(f.shap_value))
  );

  return (
    <div className="space-y-4">
      {/* TreeSHAP Diverging Attribution */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="font-mono text-[11px] text-mist-300 uppercase tracking-wider">
            Model Attribution (TreeSHAP)
          </p>
          <span className="text-[10px] font-mono text-mist-500">
            Base: {urlExplanations ? (urlExplanations.base_value * 100).toFixed(1) + "%" : "unavailable"}
          </span>
        </div>

        <p className="text-[11px] text-mist-500 mb-3 leading-relaxed">
          Feature contribution toward phishing vs legitimate verdict. Explains internal model weights, not ground truth.
        </p>

        {topFeatures.length > 0 ? (
          <div className="space-y-2 border border-surface-border rounded p-3 bg-surface-canvas/60">
            {/* Axis Header */}
            <div className="flex justify-between text-[10px] font-mono text-mist-500 border-b border-surface-border pb-1">
              <span className="text-verdict-legit">← Toward Legit</span>
              <span>0.0</span>
              <span className="text-verdict-phish">Toward Phish →</span>
            </div>

            {topFeatures.map((item) => {
              const isPhish = item.direction === "phishing";
              const barWidth = `${Math.min(100, (Math.abs(item.shap_value) / maxAbsShap) * 100)}%`;

              return (
                <div key={item.feature} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-mist-200 truncate max-w-[200px]" title={item.feature}>
                      {item.feature}
                    </span>
                    <div className="flex items-center gap-2 tabular text-[10px]">
                      <span className="text-mist-400">val: {item.value}</span>
                      <span className={isPhish ? "text-verdict-phish font-semibold" : "text-verdict-legit font-semibold"}>
                        {item.shap_value > 0 ? `+${item.shap_value.toFixed(3)}` : item.shap_value.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  {/* Diverging Bar */}
                  <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden flex">
                    <div className="w-1/2 flex justify-end">
                      {!isPhish && (
                        <div
                          className="h-full bg-verdict-legit rounded-l-full"
                          style={{ width: barWidth }}
                        />
                      )}
                    </div>
                    <div className="w-[1px] bg-surface-border h-full shrink-0" />
                    <div className="w-1/2 flex justify-start">
                      {isPhish && (
                        <div
                          className="h-full bg-verdict-phish rounded-r-full"
                          style={{ width: barWidth }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-4 text-center font-mono text-xs text-mist-500 border border-surface-border rounded">
            No TreeSHAP attribution available for this URL.
          </p>
        )}
      </div>

      {/* Raw Extracted URL Features */}
      {result.urlFeatures && (
        <details className="border border-surface-border rounded bg-surface-subtle/30 p-2.5">
          <summary className="cursor-pointer font-mono text-[11px] text-mist-400 hover:text-mist-200">
            View All Lexical Features ({Object.keys(result.urlFeatures).length})
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] max-h-48 overflow-y-auto pt-2 border-t border-surface-border">
            {Object.entries(result.urlFeatures).map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5 border-b border-surface-border/50">
                <span className="text-mist-500 truncate mr-2">{k}</span>
                <span className="text-mist-200 tabular">{typeof v === "number" ? v.toFixed(3) : String(v)}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// --- HTML FORENSICS (TreeSHAP) -------------------------------------------

function HtmlForensics({ result }: { result: UnifiedScanResult }) {
  const htmlExplanations = result.explanations?.html;
  const topFeatures = htmlExplanations?.top_features ?? [];
  const maxAbsShap = Math.max(
    0.01,
    ...topFeatures.map((f) => Math.abs(f.shap_value))
  );

  return (
    <div className="space-y-4">
      {/* TreeSHAP Diverging Attribution */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="font-mono text-[11px] text-mist-300 uppercase tracking-wider">
            Model Attribution (TreeSHAP)
          </p>
          <span className="text-[10px] font-mono text-mist-500">
            Base: {htmlExplanations ? (htmlExplanations.base_value * 100).toFixed(1) + "%" : "unavailable"}
          </span>
        </div>

        <p className="text-[11px] text-mist-500 mb-3 leading-relaxed">
          DOM structural feature contributions toward phishing vs legitimate classification.
        </p>

        {topFeatures.length > 0 ? (
          <div className="space-y-2 border border-surface-border rounded p-3 bg-surface-canvas/60">
            {/* Axis Header */}
            <div className="flex justify-between text-[10px] font-mono text-mist-500 border-b border-surface-border pb-1">
              <span className="text-verdict-legit">← Toward Legit</span>
              <span>0.0</span>
              <span className="text-verdict-phish">Toward Phish →</span>
            </div>

            {topFeatures.map((item) => {
              const isPhish = item.direction === "phishing";
              const barWidth = `${Math.min(100, (Math.abs(item.shap_value) / maxAbsShap) * 100)}%`;

              return (
                <div key={item.feature} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-mist-200 truncate max-w-[200px]" title={item.feature}>
                      {item.feature}
                    </span>
                    <div className="flex items-center gap-2 tabular text-[10px]">
                      <span className="text-mist-400">val: {item.value}</span>
                      <span className={isPhish ? "text-verdict-phish font-semibold" : "text-verdict-legit font-semibold"}>
                        {item.shap_value > 0 ? `+${item.shap_value.toFixed(3)}` : item.shap_value.toFixed(3)}
                      </span>
                    </div>
                  </div>

                  {/* Diverging Bar */}
                  <div className="h-2 w-full bg-surface-subtle rounded-full overflow-hidden flex">
                    <div className="w-1/2 flex justify-end">
                      {!isPhish && (
                        <div
                          className="h-full bg-verdict-legit rounded-l-full"
                          style={{ width: barWidth }}
                        />
                      )}
                    </div>
                    <div className="w-[1px] bg-surface-border h-full shrink-0" />
                    <div className="w-1/2 flex justify-start">
                      {isPhish && (
                        <div
                          className="h-full bg-verdict-phish rounded-r-full"
                          style={{ width: barWidth }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="p-4 text-center font-mono text-xs text-mist-500 border border-surface-border rounded">
            {result.skipReasons.html
              ? `DOM model skipped: ${result.skipReasons.html}`
              : "No HTML TreeSHAP attribution available."}
          </p>
        )}
      </div>

      {/* Raw HTML Inspector */}
      {result.htmlPreview && (
        <details className="border border-surface-border rounded bg-surface-subtle/30 p-2.5">
          <summary className="cursor-pointer font-mono text-[11px] text-mist-400 hover:text-mist-200">
            Raw HTML Preview ({result.htmlPreview.fullLength.toLocaleString()} characters)
          </summary>
          <pre className="mt-2 max-h-56 overflow-auto font-mono text-[10px] text-mist-400 bg-surface-canvas p-2.5 rounded border border-surface-border whitespace-pre-wrap break-all">
            {result.htmlPreview.content}
          </pre>
        </details>
      )}
    </div>
  );
}

// --- TEXT FORENSICS (TF-IDF N-grams) --------------------------------------

function TextForensics({ result }: { result: UnifiedScanResult }) {
  const textExplanations = result.explanations?.text;
  const topNgrams = textExplanations?.top_ngrams ?? [];

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <p className="font-mono text-[11px] text-mist-300 uppercase tracking-wider">
            Model Attribution (Linear N-Grams)
          </p>
          <span className="text-[10px] font-mono text-mist-500">
            Intercept: {textExplanations ? textExplanations.intercept.toFixed(2) : "unavailable"}
          </span>
        </div>

        <p className="text-[11px] text-mist-500 mb-3 leading-relaxed">
          Significant n-gram tokens and their linear TF-IDF contributions to the text model score.
        </p>

        {topNgrams.length > 0 ? (
          <div className="border border-surface-border rounded overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-surface-subtle/60 text-mist-500 border-b border-surface-border text-[10px]">
                <tr>
                  <th className="py-2 px-3">N-Gram Token</th>
                  <th className="py-2 px-2 text-right">TF-IDF</th>
                  <th className="py-2 px-2 text-right">Weight</th>
                  <th className="py-2 px-3 text-right">Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {topNgrams.map((item) => {
                  const isPhish = item.direction === "phishing";
                  return (
                    <tr key={item.ngram} className="hover:bg-surface-subtle/30 transition-colors">
                      <td className="py-2 px-3 text-mist-200">"{item.ngram}"</td>
                      <td className="py-2 px-2 text-right text-mist-400 tabular">{item.tfidf.toFixed(3)}</td>
                      <td className="py-2 px-2 text-right text-mist-400 tabular">{item.coefficient.toFixed(3)}</td>
                      <td
                        className={`py-2 px-3 text-right tabular font-semibold ${
                          isPhish ? "text-verdict-phish" : "text-verdict-legit"
                        }`}
                      >
                        {item.contribution > 0 ? `+${item.contribution.toFixed(3)}` : item.contribution.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-4 text-center font-mono text-xs text-mist-500 border border-surface-border rounded">
            {result.skipReasons.text
              ? `Text model skipped: ${result.skipReasons.text}`
              : "No text n-grams identified."}
          </p>
        )}
      </div>

      {/* Visible Text Content Preview */}
      {result.textPreview && (
        <details className="border border-surface-border rounded bg-surface-subtle/30 p-2.5">
          <summary className="cursor-pointer font-mono text-[11px] text-mist-400 hover:text-mist-200">
            Visible Text Sample ({result.textPreview.wordCount ?? 0} words)
          </summary>
          <pre className="mt-2 max-h-56 overflow-auto font-mono text-[10px] text-mist-400 bg-surface-canvas p-2.5 rounded border border-surface-border whitespace-pre-wrap break-all">
            {result.textPreview.content}
          </pre>
        </details>
      )}
    </div>
  );
}

// --- VISION FORENSICS ----------------------------------------------------

function VisionForensics({ result }: { result: UnifiedScanResult }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="font-mono text-[11px] text-mist-300 uppercase tracking-wider mb-1.5">
          Visual Layout Evidence
        </p>
        <p className="text-[11px] text-mist-500 mb-3 leading-relaxed">
          Deep visual feature representations extracted via ResNet-18 backbone (512-dimensional embedding).
        </p>

        {result.screenshotUrl ? (
          <div className="border border-surface-border rounded overflow-hidden bg-surface-canvas p-2">
            <img
              src={result.screenshotUrl}
              alt="Website screenshot"
              className="w-full h-auto max-h-[380px] object-contain rounded border border-surface-border bg-black"
            />
          </div>
        ) : (
          <div className="p-6 text-center font-mono text-xs text-mist-500 border border-surface-border rounded bg-surface-subtle/20">
            <p>No screenshot captured or uploaded for this scan.</p>
            <p className="mt-1 text-[11px] text-mist-600">
              The vision model was skipped ({result.skipReasons.vision ?? "no screenshot provided"}).
            </p>
          </div>
        )}
      </div>

      {/* Domain Shift Caveat Notice */}
      <div className="border border-surface-border bg-surface-subtle/40 rounded p-3 text-[11px] font-mono text-mist-400 space-y-1.5">
        <span className="text-mist-200 font-semibold block">Empirical Domain Shift Note</span>
        <p className="leading-relaxed text-mist-500">
          Standalone vision False Positive Rate surges from 14.3% to 82.7% when rendering saved HTML offline without external assets. The multimodal fusion model maintains 96.3% accuracy by weighting DOM and URL features together.
        </p>
      </div>
    </div>
  );
}
