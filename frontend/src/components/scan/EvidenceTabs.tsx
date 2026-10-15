import { useState } from "react";
import { UnifiedScanResult } from "../../lib/scanResult";
import { Tabs } from "../ui/Tabs";
import { FeatureTable } from "../ui/FeatureTable";
import { SignalRows } from "../ui/SignalRow";
import { urlEvidence, htmlEvidence } from "../../lib/evidence";

type TabKey = "url" | "dom" | "text" | "visual";

export function EvidenceTabs({ result }: { result: UnifiedScanResult }) {
  const [tab, setTab] = useState<TabKey>("url");

  return (
    <div className="surface min-w-0 px-5 py-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">What the models saw</p>
        <Tabs
          tabs={[
            { key: "url", label: "URL" },
            { key: "dom", label: "HTML / DOM" },
            { key: "text", label: "Text" },
            { key: "visual", label: "Visual" },
          ]}
          active={tab}
          onChange={(k) => setTab(k as TabKey)}
        />
      </div>

      <div className="mt-5 min-w-0">
        {tab === "url" &&
          (result.urlFeatures ? (
            <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Suspicious indicators</p>
                <SignalRows signals={urlEvidence(result.urlFeatures)} />
              </div>
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Lexical statistics (24 features)</p>
                <FeatureTable features={result.urlFeatures as unknown as Record<string, number>} limit={8} />
              </div>
            </div>
          ) : (
            <EmptyLine text="No URL features available." />
          ))}

        {tab === "dom" &&
          (result.htmlFeatures ? (
            <div className="min-w-0 space-y-4">
              <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Structural signals</p>
                  <SignalRows signals={htmlEvidence(result.htmlFeatures)} />
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">DOM statistics</p>
                  <FeatureTable features={result.htmlFeatures as unknown as Record<string, number>} limit={8} />
                </div>
              </div>
              {result.htmlPreview && (
                <details className="min-w-0">
                  <summary className="cursor-pointer text-xs text-signal-scanSoft">
                    Inspect raw HTML ({result.htmlPreview.fullLength.toLocaleString()} chars)
                  </summary>
                  <pre className="mt-2 max-h-64 min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-white/[0.06] bg-ink-950/60 p-3 font-mono text-[11px] text-mist-400">
                    {result.htmlPreview.content}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <EmptyLine text="No HTML was available for this scan." />
          ))}

        {tab === "text" &&
          (result.textPreview ? (
            <div className="min-w-0 space-y-3">
              <div className="flex flex-wrap gap-4 text-xs text-mist-400">
                <span>{result.textPreview.fullLength.toLocaleString()} characters</span>
                <span>{(result.textPreview.wordCount ?? 0).toLocaleString()} words</span>
              </div>
              {result.pageTitle && (
                <div>
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Title</p>
                  <p className="text-sm text-mist-200">{result.pageTitle}</p>
                </div>
              )}
              <details className="min-w-0" open>
                <summary className="cursor-pointer text-xs text-signal-scanSoft">Text preview</summary>
                <pre className="mt-2 max-h-56 min-w-0 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-white/[0.06] bg-ink-950/60 p-3 font-mono text-[11px] text-mist-400">
                  {result.textPreview.content}
                </pre>
              </details>
            </div>
          ) : (
            <EmptyLine text="No visible text was available for this scan." />
          ))}

        {tab === "visual" &&
          (result.screenshotUrl ? (
            <div className="min-w-0">
              {result.visionInfo && (
                <div className="mb-3 flex flex-wrap gap-4 text-xs text-mist-400">
                  <span>embedding dim: {result.visionInfo.embeddingDim}</span>
                  <span>backbone: {result.visionInfo.backbone}</span>
                </div>
              )}
              <img
                src={result.screenshotUrl}
                alt="Page screenshot"
                className="mx-auto max-h-[520px] w-full min-w-0 rounded-lg border border-white/10 object-contain"
              />
            </div>
          ) : (
            <EmptyLine text="No screenshot was uploaded for this scan — the vision model was skipped." />
          ))}
      </div>
    </div>
  );
}

function EmptyLine({ text }: { text: string }) {
  return <p className="py-6 text-center text-sm text-mist-500">{text}</p>;
}
