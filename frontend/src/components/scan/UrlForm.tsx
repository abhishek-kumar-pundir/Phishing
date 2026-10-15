import { useRef, useState } from "react";
import { PredictRequestInput } from "../../api/phish360";

interface Props {
  onSubmit: (input: PredictRequestInput) => void;
  busy?: boolean;
}

type AdvancedMode = "fetch" | "paste-html" | "upload-html" | "url-only";

export function UrlForm({ onSubmit, busy }: Props) {
  const [url, setUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<AdvancedMode>("fetch");
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

    const base: PredictRequestInput = { url: normalizedUrl, allowFetch: false };

    if (mode === "fetch") {
      base.allowFetch = true;
    } else if (mode === "paste-html" && pastedHtml.trim()) {
      base.html = pastedHtml;
    } else if (mode === "upload-html" && uploadedHtml) {
      base.html = uploadedHtml.content;
    }
    // "url-only" leaves allowFetch false and html undefined -- URL model only.

    if (screenshot) base.screenshot = screenshot;

    onSubmit(base);
  };

  return (
    <form onSubmit={submit} className="min-w-0">
      <div className="surface relative overflow-hidden px-5 py-8 sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 faint-grid-bg" />

        <div className="relative mx-auto max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-signal-scan/25 bg-signal-scan/[0.08] px-3 py-1 text-[11px] font-medium text-signal-scanSoft">
            <span className="h-1.5 w-1.5 rounded-full bg-signal-scan" />
            Multimodal phishing detection
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-mist-100 sm:text-3xl">
            Investigate a website
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-mist-400">
            Four independent AI models analyze the URL, the page's HTML, its visible text, and how it looks —
            then a fusion model combines the evidence into one verdict.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
            <input
              type="text"
              inputMode="url"
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-ink-950/60 px-4 py-3 text-sm text-mist-100 placeholder:text-mist-600 outline-none focus:border-signal-scan/50 focus:ring-2 focus:ring-signal-scan/20"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="shrink-0 rounded-xl bg-signal-scan px-5 py-3 text-sm font-semibold text-white shadow-glow transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy ? "Analyzing…" : "Analyze website"}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3 text-[11px] text-mist-500">
            <span>URL</span>
            <Dot />
            <span>HTML</span>
            <Dot />
            <span>Text</span>
            <Dot />
            <span>Vision</span>
          </div>
        </div>
      </div>

      <div className="mt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-sm text-mist-300 transition-colors hover:bg-white/[0.04]"
        >
          <span className="font-medium">Advanced options</span>
          <svg
            viewBox="0 0 16 16"
            className={`h-4 w-4 text-mist-500 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
            fill="none"
          >
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="animate-fadeIn surface mt-2 space-y-4 px-4 py-4 sm:px-5">
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Ingestion mode</p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    ["fetch", "Fetch live page"],
                    ["paste-html", "Paste HTML"],
                    ["upload-html", "Upload HTML"],
                    ["url-only", "URL only"],
                  ] as [AdvancedMode, string][]
                ).map(([m, label]) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      mode === m
                        ? "border-signal-scan/40 bg-signal-scan/12 text-mist-100"
                        : "border-white/10 text-mist-400 hover:text-mist-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11px] text-mist-500">
                {mode === "fetch" && "The backend safely fetches the page server-side (SSRF-guarded) so HTML/DOM and text models can run."}
                {mode === "paste-html" && "Paste raw HTML directly — nothing is fetched over the network."}
                {mode === "upload-html" && "Upload a saved .html file — nothing is fetched over the network."}
                {mode === "url-only" && "Only the URL model runs. Fastest, but skips HTML, text and vision."}
              </p>
            </div>

            {mode === "paste-html" && (
              <textarea
                value={pastedHtml}
                onChange={(e) => setPastedHtml(e.target.value)}
                placeholder="<html>…</html>"
                rows={5}
                className="w-full min-w-0 resize-y rounded-lg border border-white/10 bg-ink-950/60 px-3 py-2 font-mono text-xs text-mist-100 outline-none focus:border-signal-scan/40"
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
                  className="rounded-lg border border-dashed border-white/15 px-4 py-3 text-xs text-mist-400 hover:border-white/30"
                >
                  {uploadedHtml ? `Loaded: ${uploadedHtml.name}` : "Choose an .html file"}
                </button>
              </div>
            )}

            <div className="min-w-0 border-t border-white/[0.06] pt-4">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">
                Screenshot (optional — enables the vision model)
              </p>
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
                className="rounded-lg border border-dashed border-white/15 px-4 py-3 text-xs text-mist-400 hover:border-white/30"
              >
                {screenshot ? `Loaded: ${screenshot.name}` : "Upload a screenshot"}
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

function Dot() {
  return <span className="h-1 w-1 rounded-full bg-mist-600" />;
}
