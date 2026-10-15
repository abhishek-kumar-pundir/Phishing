// Thin client for the Phish360 FastAPI backend. Every field here mirrors
// api/app.py exactly -- nothing here invents a field the backend doesn't send.

export const API_BASE = import.meta.env.VITE_PHISH360_API ?? "http://localhost:8000";

export type Modality = "url" | "html" | "text" | "vision";

export interface PredictRequestInput {
  url: string;
  html?: string;
  screenshot?: File;
  allowFetch: boolean;
}

export interface UrlFeatures {
  url_length: number;
  host_length: number;
  path_length: number;
  num_dots: number;
  num_hyphens: number;
  num_underscores: number;
  num_slashes: number;
  num_question_marks: number;
  num_equals: number;
  num_at_symbols: number;
  num_ampersands: number;
  num_digits: number;
  digit_ratio: number;
  num_percent: number;
  has_https: number;
  has_ip_host: number;
  num_subdomains: number;
  has_port: number;
  url_entropy: number;
  host_entropy: number;
  suspicious_keyword_count: number;
  has_suspicious_tld: number;
  double_slash_in_path: number;
  num_www: number;
}

export interface HtmlFeatures {
  num_forms: number;
  num_password_inputs: number;
  num_hidden_inputs: number;
  num_inputs_total: number;
  num_iframes: number;
  num_images: number;
  num_scripts: number;
  external_script_ratio: number;
  external_link_ratio: number;
  num_links: number;
  num_external_form_actions: number;
  title_length: number;
  has_title: number;
  has_meta_refresh: number;
  has_favicon: number;
  visible_text_length: number;
  html_length: number;
  text_to_html_ratio: number;
}

// One line of the SSE stream, as emitted by predict_stream()'s _sse() calls.
export interface StreamEvent {
  stage: "url" | "fetch" | "html" | "text" | "vision" | "fusion" | "done" | "error";
  score?: number | null;
  skipped?: string;
  message?: string;
  url_features?: UrlFeatures;
  html_features?: HtmlFeatures;
  final_url?: string;
  status_code?: number;
  page_title?: string;
  html_length?: number;
  html_preview?: string;
  fetch_duration_ms?: number;
  text_length?: number;
  word_count?: number;
  text_preview?: string;
  embedding_dim?: number;
  backbone?: string;
  request_id?: string;
  scan_id?: number | null;
  phishing_probability?: number | null;
  predicted_label?: "phishing" | "legitimate" | null;
  threshold?: number;
  fusion_strategy?: string;
  fetched_from?: string | null;
  scan_duration_ms?: number;
}

export interface HealthResponse {
  status: string;
  models_available: string[];
}

export interface ConfusionMatrix {
  labels: [string, string];
  matrix: [[number, number], [number, number]];
}

export interface ClassificationReportRow {
  precision: number;
  recall: number;
  "f1-score": number;
  support: number;
}

export interface StandaloneMetric {
  positive_label: string;
  threshold: number;
  n_samples: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  roc_auc: number | null;
  pr_auc: number | null;
  confusion_matrix: ConfusionMatrix;
  classification_report: Record<string, ClassificationReportRow | number>;
}

export interface PriorityEntry {
  modality: Modality;
  standalone_accuracy: number | null;
  fusion_contribution: number;
}

export interface ModelInfoResponse {
  standalone_metrics: Partial<Record<Modality, StandaloneMetric | null>>;
  ablation: Record<string, StandaloneMetric>;
  priority: PriorityEntry[] | null;
  fusion_logreg_coefficients: Partial<Record<Modality, number>> | null;
  fusion_logreg_intercept: number | null;
  threshold: number;
}

export interface ErrorExample {
  sample_id: string;
  true_label: string;
  predicted_label: string;
  fused_probability: number;
  modality_probabilities: Record<Modality, number>;
}

export interface ErrorAnalysisResponse {
  source: string;
  n_test_samples: number;
  n_errors: number;
  false_positives: ErrorExample[];
  false_negatives: ErrorExample[];
}

export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error(`/health failed: ${res.status}`);
  return res.json();
}

export async function fetchModelInfo(): Promise<ModelInfoResponse> {
  const res = await fetch(`${API_BASE}/model-info`);
  if (!res.ok) throw new Error(`/model-info failed: ${res.status}`);
  return res.json();
}

export async function fetchErrorAnalysis(limit = 8): Promise<ErrorAnalysisResponse> {
  const res = await fetch(`${API_BASE}/error-analysis?limit=${limit}`);
  if (!res.ok) throw new Error(`/error-analysis failed: ${res.status}`);
  return res.json();
}

export interface ScanRecord {
  id: number;
  ts: string;
  url: string;
  fetched_from: string | null;
  score_url: number | null;
  score_html: number | null;
  score_text: number | null;
  score_vision: number | null;
  fused_probability: number | null;
  predicted_label: "phishing" | "legitimate" | null;
  fusion_strategy: string | null;
}

export interface HistogramBucket {
  bucket_start: number;
  bucket_end: number;
  count: number;
}

export interface ModalityStat {
  count_scored: number;
  mean_score: number | null;
  histogram: HistogramBucket[];
}

export interface TimelinePoint {
  ts: string;
  url: string;
  fused_probability: number | null;
  predicted_label: "phishing" | "legitimate" | null;
}

export interface ScanStatsResponse {
  total_scans: number;
  label_counts: { phishing: number; legitimate: number };
  fused_probability_histogram: HistogramBucket[];
  per_modality: Partial<Record<Modality, ModalityStat>>;
  timeline: TimelinePoint[];
}

export async function fetchScans(limit = 50): Promise<{ scans: ScanRecord[] }> {
  const res = await fetch(`${API_BASE}/scans?limit=${limit}`);
  if (!res.ok) throw new Error(`/scans failed: ${res.status}`);
  return res.json();
}

export async function fetchScanStats(): Promise<ScanStatsResponse> {
  const res = await fetch(`${API_BASE}/scans/stats`);
  if (!res.ok) throw new Error(`/scans/stats failed: ${res.status}`);
  return res.json();
}

// --- Full historical scan detail (GET /scans/{id}) -----------------------
// Mirrors api/app.py's _scan_record_to_detail() exactly.

export interface ScanDetailResponse {
  id: number;
  ts: string;
  request_id: string | null;
  url: string;
  fetched_from: string | null;
  status_code: number | null;
  page_title: string | null;
  fetch_duration_ms: number | null;
  per_modality_scores: Partial<Record<Modality, number | null>>;
  modality_skip_reasons: Partial<Record<Modality, string>>;
  fused_probability: number | null;
  predicted_label: "phishing" | "legitimate" | null;
  fusion_strategy: string | null;
  threshold: number | null;
  scan_duration_ms: number | null;
  evidence: {
    url_features: UrlFeatures | null;
    html_features: HtmlFeatures | null;
    html_preview: { content: string; full_length: number } | null;
    text_preview: { content: string; full_length: number; word_count: number | null } | null;
    vision: { embedding_dim: number | null; backbone: string | null } | null;
    screenshot_url: string | null;
  };
}

export async function fetchScanDetail(scanId: number | string): Promise<ScanDetailResponse> {
  const res = await fetch(`${API_BASE}/scans/${scanId}`);
  if (!res.ok) throw new Error(`/scans/${scanId} failed: ${res.status}`);
  return res.json();
}

export function scanScreenshotUrl(scanId: number | string): string {
  return `${API_BASE}/scans/${scanId}/screenshot`;
}

function buildFormData(input: PredictRequestInput): FormData {
  const form = new FormData();
  form.set("url", input.url);
  if (input.html) form.set("html", input.html);
  form.set("allow_fetch", String(input.allowFetch));
  if (input.screenshot) form.set("screenshot", input.screenshot);
  return form;
}

/**
 * Streams /predict/stream and yields one StreamEvent per SSE line, as it
 * arrives -- no buffering the whole response first. Uses fetch() +
 * ReadableStream because this endpoint takes a POST body (form + optional
 * file upload), which the browser's native EventSource cannot send.
 */
export async function* streamPredict(
  input: PredictRequestInput,
  signal?: AbortSignal
): AsyncGenerator<StreamEvent> {
  const res = await fetch(`${API_BASE}/predict/stream`, {
    method: "POST",
    body: buildFormData(input),
    signal,
  });

  if (!res.ok || !res.body) {
    const detail = await res.text().catch(() => "");
    throw new Error(`/predict/stream failed: ${res.status} ${detail}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const rawFrame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        const dataLine = rawFrame.split("\n").find((line) => line.startsWith("data:"));
        if (!dataLine) continue;

        const jsonStr = dataLine.slice("data:".length).trim();
        if (!jsonStr) continue;

        try {
          yield JSON.parse(jsonStr) as StreamEvent;
        } catch {
          // Malformed frame -- skip rather than crash the whole stream.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
