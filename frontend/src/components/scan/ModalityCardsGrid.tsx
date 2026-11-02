import React, { useState } from "react";
import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";
import { DomGlyph, TextGlyph, UrlGlyph, VisionGlyph } from "../ui/Glyphs";

interface Props {
  result: UnifiedScanResult;
  selectedModality?: Modality;
  onSelectModality?: (m: Modality) => void;
}

const MODALITY_META: Record<
  Modality,
  {
    label: string;
    sublabel: string;
    model: string;
    weight: number;
    weightPct: string;
    glyph: React.FC<{ size?: number; className?: string }>;
  }
> = {
  url: {
    label: "URL Lexical Model",
    sublabel: "Lexical structure & domain entropy",
    model: "Random Forest",
    weight: 3.5985,
    weightPct: "29.1%",
    glyph: UrlGlyph,
  },
  html: {
    label: "DOM Structural Model",
    sublabel: "Form hierarchy, tags & external links",
    model: "Random Forest",
    weight: 2.6307,
    weightPct: "21.3%",
    glyph: DomGlyph,
  },
  text: {
    label: "Text Semantic Model",
    sublabel: "Page body content & phishing semantics",
    model: "Linear TF-IDF",
    weight: 4.9169,
    weightPct: "39.8%",
    glyph: TextGlyph,
  },
  vision: {
    label: "Vision Layout Model",
    sublabel: "Visual layout embedding via ResNet-18",
    model: "ResNet-18",
    weight: 1.2024,
    weightPct: "9.7%",
    glyph: VisionGlyph,
  },
};

export function ModalityCardsGrid({
  result,
  selectedModality = "url",
  onSelectModality,
}: Props) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  return (
    <div className="space-y-4 pt-1 font-sans min-w-0">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Modality Evidence & Model Attribution (4 Channels)
          </h2>
          <p className="text-[11px] text-mist-400 mt-0.5">
            Independent per-modality forensics and TreeSHAP attribution driving the calibrated fusion verdict.
          </p>
        </div>

        {/* Quick Jump / Selection Pills */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-mist-500 text-[10px] uppercase mr-1">Focus:</span>
          {(["url", "html", "text", "vision"] as Modality[]).map((m) => {
            const isSelected = selectedModality === m;
            const score = result.scores[m];
            const meta = MODALITY_META[m];
            const Glyph = meta.glyph;

            return (
              <button
                key={m}
                type="button"
                onClick={() => onSelectModality?.(m)}
                className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition-colors ${
                  isSelected
                    ? "border-brand text-brand bg-brand/10 font-semibold"
                    : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
                }`}
              >
                <Glyph size={12} className={isSelected ? "text-brand" : "text-mist-500"} />
                <span>{m.toUpperCase()}</span>
                {score != null && (
                  <span className="tabular text-[10px] text-mist-300">
                    {pct(score, 0)}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2 Rows × 2 Columns Forensic Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch min-w-0">
        {/* Box 1 (Row 1, Col 1): URL Lexical Card */}
        <UrlCard
          result={result}
          isSelected={selectedModality === "url"}
          onSelect={() => onSelectModality?.(mMod("url"))}
        />

        {/* Box 2 (Row 1, Col 2): DOM Structural Card */}
        <HtmlCard
          result={result}
          isSelected={selectedModality === "html"}
          onSelect={() => onSelectModality?.(mMod("html"))}
        />

        {/* Box 3 (Row 2, Col 1): Text Semantic Card */}
        <TextCard
          result={result}
          isSelected={selectedModality === "text"}
          onSelect={() => onSelectModality?.(mMod("text"))}
        />

        {/* Box 4 (Row 2, Col 2): Vision Layout Card */}
        <VisionCard
          result={result}
          isSelected={selectedModality === "vision"}
          onSelect={() => onSelectModality?.(mMod("vision"))}
          onEnlarge={(url) => setLightboxUrl(url)}
        />
      </div>

      {/* Screenshot Lightbox Modal */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-surface-canvas/90 p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-surface-card border border-surface-border rounded-lg p-2 overflow-hidden">
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 z-10 bg-surface-subtle border border-surface-border text-mist-200 px-2.5 py-1 rounded text-xs font-mono hover:text-white"
            >
              CLOSE ✕
            </button>
            <img
              src={lightboxUrl}
              alt="Enlarged screenshot capture"
              className="w-full h-auto max-h-[85vh] object-contain rounded bg-black"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function mMod(m: Modality): Modality {
  return m;
}

// =============================================================================
// Box 1: URL Lexical Card
// =============================================================================

function UrlCard({
  result,
  isSelected,
  onSelect,
}: {
  result: UnifiedScanResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meta = MODALITY_META.url;
  const Glyph = meta.glyph;
  const score = result.scores.url;
  const skip = result.skipReasons.url;
  const tone = riskTone(score);

  const urlExplanations = result.explanations?.url;
  const topFeatures = urlExplanations?.top_features ?? [];
  const maxAbsShap = Math.max(0.01, ...topFeatures.map((f) => Math.abs(f.shap_value)));

  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg bg-surface-card flex flex-col p-5 space-y-4 transition-all cursor-pointer ${
        isSelected
          ? "border-brand ring-1 ring-brand/30 shadow-[0_0_0_1px_rgba(56,192,228,0.2)]"
          : "border-surface-border hover:border-surface-borderLight"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-surface-border bg-surface-subtle flex items-center justify-center text-brand">
            <Glyph size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
                {meta.label}
              </h3>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-surface-border text-mist-400 bg-surface-subtle">
                {meta.model}
              </span>
            </div>
            <p className="text-[11px] text-mist-400 mt-0.5">{meta.sublabel}</p>
          </div>
        </div>

        {/* Score & Weight */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1.5">
            <span
              className={`font-mono text-xl font-bold tabular ${
                score != null
                  ? tone === "danger"
                    ? "text-verdict-phish"
                    : tone === "safe"
                    ? "text-verdict-legit"
                    : "text-verdict-review"
                  : "text-mist-500"
              }`}
            >
              {score != null ? pct(score, 1) : skip ? "SKIP" : "—"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-mist-500 block">
            Fusion Wt: {meta.weight.toFixed(2)} ({meta.weightPct})
          </span>
        </div>
      </div>

      {/* TreeSHAP Model Attribution */}
      <div className="space-y-2 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase text-mist-400 font-semibold tracking-wider">
            Model Attribution (TreeSHAP)
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            Base: {urlExplanations ? (urlExplanations.base_value * 100).toFixed(1) + "%" : "unavailable"}
          </span>
        </div>

        <p className="text-[11px] text-mist-500 leading-relaxed">
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
                    <span className="text-mist-200 truncate max-w-[210px]" title={item.feature}>
                      {item.feature}
                    </span>
                    <div className="flex items-center gap-2 tabular text-[10px]">
                      <span className="text-mist-400">val: {item.value}</span>
                      <span
                        className={
                          isPhish
                            ? "text-verdict-phish font-semibold"
                            : "text-verdict-legit font-semibold"
                        }
                      >
                        {item.shap_value > 0
                          ? `+${item.shap_value.toFixed(3)}`
                          : item.shap_value.toFixed(3)}
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
          <div className="p-4 text-center font-mono text-xs text-mist-500 border border-surface-border rounded bg-surface-subtle/30">
            {skip ? `URL model skipped: ${skip}` : "No TreeSHAP attribution available for this URL."}
          </div>
        )}
      </div>

      {/* Raw Extracted URL Features (Expandable) */}
      {result.urlFeatures && (
        <details
          onClick={(e) => e.stopPropagation()}
          className="border border-surface-border rounded bg-surface-subtle/30 p-2.5 pt-2"
        >
          <summary className="cursor-pointer font-mono text-[11px] text-mist-400 hover:text-mist-200">
            View All Lexical Features ({Object.keys(result.urlFeatures).length})
          </summary>
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[10px] max-h-40 overflow-y-auto pt-2 border-t border-surface-border">
            {Object.entries(result.urlFeatures).map(([k, v]) => (
              <div key={k} className="flex justify-between py-0.5 border-b border-surface-border/50">
                <span className="text-mist-500 truncate mr-2">{k}</span>
                <span className="text-mist-200 tabular">
                  {typeof v === "number" ? v.toFixed(3) : String(v)}
                </span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

// =============================================================================
// Box 2: DOM / HTML Structural Card
// =============================================================================

function HtmlCard({
  result,
  isSelected,
  onSelect,
}: {
  result: UnifiedScanResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meta = MODALITY_META.html;
  const Glyph = meta.glyph;
  const score = result.scores.html;
  const skip = result.skipReasons.html;
  const tone = riskTone(score);

  const htmlExplanations = result.explanations?.html;
  const topFeatures = htmlExplanations?.top_features ?? [];
  const maxAbsShap = Math.max(0.01, ...topFeatures.map((f) => Math.abs(f.shap_value)));

  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg bg-surface-card flex flex-col p-5 space-y-4 transition-all cursor-pointer ${
        isSelected
          ? "border-brand ring-1 ring-brand/30 shadow-[0_0_0_1px_rgba(56,192,228,0.2)]"
          : "border-surface-border hover:border-surface-borderLight"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-surface-border bg-surface-subtle flex items-center justify-center text-brand">
            <Glyph size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
                {meta.label}
              </h3>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-surface-border text-mist-400 bg-surface-subtle">
                {meta.model}
              </span>
            </div>
            <p className="text-[11px] text-mist-400 mt-0.5">{meta.sublabel}</p>
          </div>
        </div>

        {/* Score & Weight */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1.5">
            <span
              className={`font-mono text-xl font-bold tabular ${
                score != null
                  ? tone === "danger"
                    ? "text-verdict-phish"
                    : tone === "safe"
                    ? "text-verdict-legit"
                    : "text-verdict-review"
                  : "text-mist-500"
              }`}
            >
              {score != null ? pct(score, 1) : skip ? "SKIP" : "—"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-mist-500 block">
            Fusion Wt: {meta.weight.toFixed(2)} ({meta.weightPct})
          </span>
        </div>
      </div>

      {/* TreeSHAP Model Attribution */}
      <div className="space-y-2 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase text-mist-400 font-semibold tracking-wider">
            Model Attribution (TreeSHAP)
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            Base: {htmlExplanations ? (htmlExplanations.base_value * 100).toFixed(1) + "%" : "unavailable"}
          </span>
        </div>

        <p className="text-[11px] text-mist-500 leading-relaxed">
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
                    <span className="text-mist-200 truncate max-w-[210px]" title={item.feature}>
                      {item.feature}
                    </span>
                    <div className="flex items-center gap-2 tabular text-[10px]">
                      <span className="text-mist-400">val: {item.value}</span>
                      <span
                        className={
                          isPhish
                            ? "text-verdict-phish font-semibold"
                            : "text-verdict-legit font-semibold"
                        }
                      >
                        {item.shap_value > 0
                          ? `+${item.shap_value.toFixed(3)}`
                          : item.shap_value.toFixed(3)}
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
          <div className="p-4 text-center font-mono text-xs text-mist-500 border border-surface-border rounded bg-surface-subtle/30">
            {skip
              ? `DOM model skipped: ${skip}`
              : "No HTML TreeSHAP attribution available for this scan."}
          </div>
        )}
      </div>

      {/* Raw HTML Preview (Expandable) */}
      {result.htmlPreview && (
        <details
          onClick={(e) => e.stopPropagation()}
          className="border border-surface-border rounded bg-surface-subtle/30 p-2.5 pt-2"
        >
          <summary className="cursor-pointer font-mono text-[11px] text-mist-400 hover:text-mist-200">
            Raw HTML Preview ({result.htmlPreview.fullLength.toLocaleString()} characters)
          </summary>
          <pre className="mt-2 max-h-40 overflow-auto font-mono text-[10px] text-mist-400 bg-surface-canvas p-2.5 rounded border border-surface-border whitespace-pre-wrap break-all">
            {result.htmlPreview.content}
          </pre>
        </details>
      )}
    </div>
  );
}

// =============================================================================
// Box 3: Text Semantic Card
// =============================================================================

function TextCard({
  result,
  isSelected,
  onSelect,
}: {
  result: UnifiedScanResult;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const meta = MODALITY_META.text;
  const Glyph = meta.glyph;
  const score = result.scores.text;
  const skip = result.skipReasons.text;
  const tone = riskTone(score);

  const textExplanations = result.explanations?.text;
  const topNgrams = textExplanations?.top_ngrams ?? [];

  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg bg-surface-card flex flex-col p-5 space-y-4 transition-all cursor-pointer ${
        isSelected
          ? "border-brand ring-1 ring-brand/30 shadow-[0_0_0_1px_rgba(56,192,228,0.2)]"
          : "border-surface-border hover:border-surface-borderLight"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-surface-border bg-surface-subtle flex items-center justify-center text-brand">
            <Glyph size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
                {meta.label}
              </h3>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-surface-border text-mist-400 bg-surface-subtle">
                {meta.model}
              </span>
            </div>
            <p className="text-[11px] text-mist-400 mt-0.5">{meta.sublabel}</p>
          </div>
        </div>

        {/* Score & Weight */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1.5">
            <span
              className={`font-mono text-xl font-bold tabular ${
                score != null
                  ? tone === "danger"
                    ? "text-verdict-phish"
                    : tone === "safe"
                    ? "text-verdict-legit"
                    : "text-verdict-review"
                  : "text-mist-500"
              }`}
            >
              {score != null ? pct(score, 1) : skip ? "SKIP" : "—"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-mist-500 block">
            Fusion Wt: {meta.weight.toFixed(2)} ({meta.weightPct})
          </span>
        </div>
      </div>

      {/* Model Attribution (Linear N-Grams) */}
      <div className="space-y-2 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase text-mist-400 font-semibold tracking-wider">
            Model Attribution (Linear N-Grams)
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            Intercept: {textExplanations ? textExplanations.intercept.toFixed(2) : "unavailable"}
          </span>
        </div>

        <p className="text-[11px] text-mist-500 leading-relaxed">
          Significant n-gram tokens and their linear TF-IDF contributions to the text model score.
        </p>

        {topNgrams.length > 0 ? (
          <div className="border border-surface-border rounded overflow-hidden">
            <table className="w-full text-left font-mono text-[11px]">
              <thead className="bg-surface-subtle/60 text-mist-500 border-b border-surface-border text-[10px]">
                <tr>
                  <th className="py-2 px-3">Token</th>
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
                      <td className="py-2 px-2 text-right text-mist-400 tabular">
                        {item.tfidf.toFixed(3)}
                      </td>
                      <td className="py-2 px-2 text-right text-mist-400 tabular">
                        {item.coefficient.toFixed(3)}
                      </td>
                      <td
                        className={`py-2 px-3 text-right tabular font-semibold ${
                          isPhish ? "text-verdict-phish" : "text-verdict-legit"
                        }`}
                      >
                        {item.contribution > 0
                          ? `+${item.contribution.toFixed(3)}`
                          : item.contribution.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-center font-mono text-xs text-mist-500 border border-surface-border rounded bg-surface-subtle/30">
            {skip ? `Text model skipped: ${skip}` : "No text n-grams identified."}
          </div>
        )}
      </div>

      {/* Visible Text Content Sample (Expandable) */}
      {result.textPreview && (
        <details
          onClick={(e) => e.stopPropagation()}
          className="border border-surface-border rounded bg-surface-subtle/30 p-2.5 pt-2"
        >
          <summary className="cursor-pointer font-mono text-[11px] text-mist-400 hover:text-mist-200">
            Visible Text Sample ({result.textPreview.wordCount ?? 0} words)
          </summary>
          <pre className="mt-2 max-h-40 overflow-auto font-mono text-[10px] text-mist-400 bg-surface-canvas p-2.5 rounded border border-surface-border whitespace-pre-wrap break-all">
            {result.textPreview.content}
          </pre>
        </details>
      )}
    </div>
  );
}

// =============================================================================
// Box 4: Vision Layout Card
// =============================================================================

function VisionCard({
  result,
  isSelected,
  onSelect,
  onEnlarge,
}: {
  result: UnifiedScanResult;
  isSelected: boolean;
  onSelect: () => void;
  onEnlarge: (url: string) => void;
}) {
  const meta = MODALITY_META.vision;
  const Glyph = meta.glyph;
  const score = result.scores.vision;
  const skip = result.skipReasons.vision;
  const tone = riskTone(score);

  return (
    <div
      onClick={onSelect}
      className={`border rounded-lg bg-surface-card flex flex-col p-5 space-y-4 transition-all cursor-pointer ${
        isSelected
          ? "border-brand ring-1 ring-brand/30 shadow-[0_0_0_1px_rgba(56,192,228,0.2)]"
          : "border-surface-border hover:border-surface-borderLight"
      }`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-surface-border pb-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded border border-surface-border bg-surface-subtle flex items-center justify-center text-brand">
            <Glyph size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
                {meta.label}
              </h3>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-surface-border text-mist-400 bg-surface-subtle">
                {meta.model}
              </span>
            </div>
            <p className="text-[11px] text-mist-400 mt-0.5">{meta.sublabel}</p>
          </div>
        </div>

        {/* Score & Weight */}
        <div className="text-right shrink-0">
          <div className="flex items-baseline justify-end gap-1.5">
            <span
              className={`font-mono text-xl font-bold tabular ${
                score != null
                  ? tone === "danger"
                    ? "text-verdict-phish"
                    : tone === "safe"
                    ? "text-verdict-legit"
                    : "text-verdict-review"
                  : "text-mist-500"
              }`}
            >
              {score != null ? pct(score, 1) : skip ? "SKIP" : "—"}
            </span>
          </div>
          <span className="font-mono text-[10px] text-mist-500 block">
            Fusion Wt: {meta.weight.toFixed(2)} ({meta.weightPct})
          </span>
        </div>
      </div>

      {/* Visual Layout Evidence */}
      <div className="space-y-2 flex-1">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase text-mist-400 font-semibold tracking-wider">
            Visual Layout Evidence
          </span>
          {result.visionInfo && (
            <span className="font-mono text-[10px] text-mist-500 tabular">
              512-dim embedding · {result.visionInfo.backbone}
            </span>
          )}
        </div>

        <p className="text-[11px] text-mist-500 leading-relaxed">
          Deep visual feature representations extracted via ResNet-18 backbone.
        </p>

        {result.screenshotUrl ? (
          <div className="space-y-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                onEnlarge(result.screenshotUrl!);
              }}
              className="border border-surface-border rounded overflow-hidden bg-surface-canvas p-1.5 group relative hover:border-brand/60 transition-colors"
            >
              <img
                src={result.screenshotUrl}
                alt="Website rendered screenshot"
                className="w-full h-auto max-h-[220px] object-contain rounded border border-surface-border/50 bg-black"
              />
              <div className="absolute inset-0 bg-surface-canvas/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-mono text-[11px] text-mist-100">
                <span className="bg-surface-card/90 px-3 py-1.5 rounded border border-surface-border">
                  Click to Enlarge ⤢
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center font-mono text-xs text-mist-500 border border-surface-border rounded bg-surface-subtle/30">
            <p>No screenshot captured or uploaded for this scan.</p>
            <p className="mt-1 text-[11px] text-mist-600">
              {skip ? `Vision model skipped (${skip}).` : "Visual evidence unavailable."}
            </p>
          </div>
        )}
      </div>

      {/* Domain Shift Caveat Notice */}
      <div className="border border-surface-border bg-surface-subtle/40 rounded p-2.5 text-[10px] font-mono text-mist-400 space-y-1">
        <span className="text-mist-300 font-semibold block">Domain Shift Notice</span>
        <p className="leading-relaxed text-mist-500">
          Standalone vision FPR increases from 14.3% to 82.7% when rendering saved HTML offline without external assets. Multimodal fusion maintains 96.3% accuracy by balancing DOM and URL signals.
        </p>
      </div>
    </div>
  );
}
