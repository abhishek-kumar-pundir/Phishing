import { useRef, useState } from "react";
import { PredictRequestInput } from "../../api/phish360";

interface Props {
  onSubmit: (input: PredictRequestInput) => void;
  busy?: boolean;
}

type AdvancedMode = "fetch" | "paste-html" | "upload-html" | "url-only";
type OperatingPoint = "balanced" | "high_recall" | "high_precision" | "default";

const OPERATING_POINTS: {
  id: OperatingPoint;
  label: string;
  threshold: number;
  low?: number;
  high?: number;
}[] = [
  { id: "balanced", label: "Balanced (0.45)", threshold: 0.45, low: 0.35, high: 0.55 },
  { id: "high_recall", label: "High Recall (0.20)", threshold: 0.2, low: 0.15, high: 0.3 },
  { id: "high_precision", label: "High Precision (0.90)", threshold: 0.9, low: 0.7, high: 0.9 },
  { id: "default", label: "Default (0.50)", threshold: 0.5 },
];

export function UrlForm({ onSubmit, busy }: Props) {
  const [url, setUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<AdvancedMode>("fetch");
  const [operatingPoint, setOperatingPoint] = useState<OperatingPoint>("balanced");
  const [pastedHtml, setPastedHtml] = useState("");
  const [uploadedHtml, setUploadedHtml] = useState<{ name: string; content: string } | null>(null);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const handleHtmlFile = async (file: File | undefined) => {
    if (!file) return;
    const content = await file.text();
    setUploadedHtml({ name: file.name, content });
  };

  const canSubmit = url.trim().length > 0 && !busy;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const trimmed = url.trim();
    const normalizedUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    const opConfig = OPERATING_POINTS.find((op) => op.id === operatingPoint);

    const base: PredictRequestInput = {
      url: normalizedUrl,
      allowFetch: false,
      threshold: opConfig?.threshold,
      reviewBandLow: opConfig?.low,
      reviewBandHigh: opConfig?.high,
      operatingPoint: opConfig?.id,
    };

    if (mode === "fetch") {
      base.allowFetch = true;
    } else if (mode === "paste-html" && pastedHtml.trim()) {
      base.html = pastedHtml;
    } else if (mode === "upload-html" && uploadedHtml) {
      base.html = uploadedHtml.content;
    }
    // "url-only" leaves allowFetch false and html undefined

    if (screenshot) base.screenshot = screenshot;

    onSubmit(base);
  };

  return (
    <form onSubmit={submit} className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans min-w-0">
      <div className="flex flex-col gap-4">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
              Multimodal Website Investigation
            </h2>
            <p className="text-[11px] text-mist-400 mt-0.5">
              Calibrated inference across URL, DOM, text, and visual modalities with TreeSHAP attribution.
            </p>
          </div>

          {/* Operating Point Selector Badge */}
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <span className="text-mist-500 uppercase text-[10px]">Operating Point:</span>
            <select
              value={operatingPoint}
              onChange={(e) => setOperatingPoint(e.target.value as OperatingPoint)}
              className="bg-surface-subtle border border-surface-border rounded px-2 py-1 text-mist-200 outline-none focus:border-brand"
            >
              {OPERATING_POINTS.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Input & Action Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="url"
            autoFocus
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter target URL (e.g. https://account-verification-portal.com)"
            className="flex-1 bg-surface-canvas border border-surface-border rounded px-3 py-2 text-xs font-mono text-mist-100 placeholder:text-mist-600 outline-none focus:border-brand/60"
          />
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-4 py-2 rounded bg-brand text-surface-canvas text-xs font-semibold font-mono hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity shrink-0"
          >
            {busy ? "INVESTIGATING…" : "START SCAN"}
          </button>
        </div>

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-[11px] font-mono text-mist-400 hover:text-mist-200 flex items-center gap-1.5 transition-colors"
          >
            <span>{showAdvanced ? "[-] Hide Ingestion Options" : "[+] Advanced Ingestion & Screenshot"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 pt-3 border-t border-surface-border space-y-3 font-mono text-xs">
              <div>
                <span className="text-[10px] text-mist-500 uppercase block mb-1.5">
                  Ingestion Mode
                </span>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["fetch", "Fetch Live Page"],
                      ["paste-html", "Paste HTML"],
                      ["upload-html", "Upload HTML File"],
                      ["url-only", "URL Model Only"],
                    ] as [AdvancedMode, string][]
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`px-2.5 py-1 rounded text-[11px] border transition-colors ${
                        mode === m
                          ? "border-brand text-brand bg-brand/5"
                          : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === "paste-html" && (
                <textarea
                  value={pastedHtml}
                  onChange={(e) => setPastedHtml(e.target.value)}
                  placeholder="Paste raw HTML markup here (<html>...</html>)"
                  rows={4}
                  className="w-full bg-surface-canvas border border-surface-border rounded p-2 text-xs font-mono text-mist-100 outline-none focus:border-brand"
                />
              )}

              {mode === "upload-html" && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".html,.htm,text/html"
                    className="hidden"
                    onChange={(e) => handleHtmlFile(e.target.files?.[0])}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 border border-dashed border-surface-border rounded text-[11px] text-mist-300 hover:border-mist-400"
                  >
                    {uploadedHtml ? `Loaded: ${uploadedHtml.name}` : "Select .html file"}
                  </button>
                </div>
              )}

              {/* Optional Screenshot */}
              <div className="border-t border-surface-border pt-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-mist-500 uppercase block">
                    Upload Screenshot (Enables ResNet-18 Vision Model)
                  </span>
                  <input
                    ref={screenshotInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => screenshotInputRef.current?.click()}
                    className="mt-1 px-3 py-1.5 border border-dashed border-surface-border rounded text-[11px] text-mist-300 hover:border-mist-400"
                  >
                    {screenshot ? `Screenshot: ${screenshot.name}` : "Select Image (.png/.jpg)"}
                  </button>
                </div>
                {screenshot && (
                  <button
                    type="button"
                    onClick={() => setScreenshot(null)}
                    className="text-[10px] text-verdict-phish hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
