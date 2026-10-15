import { useCallback, useRef, useState } from "react";
import {
  HtmlFeatures,
  Modality,
  PredictRequestInput,
  StreamEvent,
  UrlFeatures,
  streamPredict,
} from "../api/phish360";

export type StepId = "url" | "fetch" | "html" | "text" | "vision" | "fusion";
export type StepStatus = "pending" | "active" | "done" | "skipped" | "error";
export type ModalityState = "idle" | "pending" | "scored" | "skipped";

export interface ContentPreview {
  content: string;
  fullLength: number;
  truncated: boolean;
}

export interface FetchInfo {
  finalUrl: string;
  statusCode: number;
  pageTitle: string;
  fetchDurationMs: number;
}

export interface VisionInfo {
  embeddingDim: number;
  backbone: string;
}

export interface FusionResult {
  probability: number | null;
  label: "phishing" | "legitimate" | null;
  strategy: string | null;
  fetchedFrom: string | null;
  threshold: number;
  requestId: string | null;
  durationMs: number | null;
  scanId: number | null;
}

export type RunPhase = "idle" | "running" | "done" | "error";

export const STEP_LABELS: Record<StepId, string> = {
  url: "Analyzing URL",
  fetch: "Fetching webpage",
  html: "Analyzing HTML / DOM",
  text: "Extracting page text",
  vision: "Analyzing visual appearance",
  fusion: "Fusing multimodal evidence",
};

function buildStepOrder(input: PredictRequestInput): StepId[] {
  const steps: StepId[] = ["url"];
  if (input.allowFetch && !input.html) steps.push("fetch");
  steps.push("html", "text", "vision", "fusion");
  return steps;
}

export function usePipelineScan() {
  const [phase, setPhase] = useState<RunPhase>("idle");
  const [scannedUrl, setScannedUrl] = useState<string>("");
  const [stepOrder, setStepOrder] = useState<StepId[]>([]);
  const [stepStatus, setStepStatus] = useState<Record<StepId, StepStatus>>({} as Record<StepId, StepStatus>);
  const [modalityScores, setModalityScores] = useState<Partial<Record<Modality, number | null>>>({});
  const [modalitySkipReason, setModalitySkipReason] = useState<Partial<Record<Modality, string>>>({});
  const [urlFeatures, setUrlFeatures] = useState<UrlFeatures | null>(null);
  const [htmlFeatures, setHtmlFeatures] = useState<HtmlFeatures | null>(null);
  const [fetchInfo, setFetchInfo] = useState<FetchInfo | null>(null);
  const [fetchedHtml, setFetchedHtml] = useState<ContentPreview | null>(null);
  const [extractedText, setExtractedText] = useState<ContentPreview | null>(null);
  const [textWordCount, setTextWordCount] = useState<number | null>(null);
  const [visionInfo, setVisionInfo] = useState<VisionInfo | null>(null);
  const [fusion, setFusion] = useState<FusionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setPhase("idle");
    setScannedUrl("");
    setStepOrder([]);
    setStepStatus({} as Record<StepId, StepStatus>);
    setModalityScores({});
    setModalitySkipReason({});
    setUrlFeatures(null);
    setHtmlFeatures(null);
    setFetchInfo(null);
    setFetchedHtml(null);
    setExtractedText(null);
    setTextWordCount(null);
    setVisionInfo(null);
    setFusion(null);
    setError(null);
  }, []);

  const start = useCallback(async (input: PredictRequestInput) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const order = buildStepOrder(input);
    const initialStatus = Object.fromEntries(order.map((s, i) => [s, i === 0 ? "active" : "pending"])) as Record<
      StepId,
      StepStatus
    >;

    setPhase("running");
    setScannedUrl(input.url);
    setStepOrder(order);
    setStepStatus(initialStatus);
    setModalityScores({});
    setModalitySkipReason({});
    setUrlFeatures(null);
    setHtmlFeatures(null);
    setFetchInfo(null);
    setFetchedHtml(null);
    setExtractedText(null);
    setTextWordCount(null);
    setVisionInfo(null);
    setFusion(null);
    setError(null);

    let localOrder = order;
    let sawDone = false;

    const advance = (finishedStep: StepId, finalStatus: StepStatus) => {
      setStepStatus((prev) => {
        const next = { ...prev, [finishedStep]: finalStatus };
        const idx = localOrder.indexOf(finishedStep);
        const nextStep = localOrder[idx + 1];
        if (nextStep && next[nextStep] === "pending") next[nextStep] = "active";
        return next;
      });
    };

    try {
      for await (const evt of streamPredict(input, controller.signal)) {
        applyEvent(evt);
        if (evt.stage === "done") sawDone = true;
      }
      setPhase(sawDone ? "done" : "error");
      if (!sawDone) {
        setError("The stream ended before a final result arrived. The backend may have hit an unhandled error mid-request.");
        setStepStatus((prev) => {
          const next = { ...prev };
          const activeStep = localOrder.find((s) => next[s] === "active");
          if (activeStep) next[activeStep] = "error";
          return next;
        });
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setPhase("error");
      setError(err instanceof Error ? err.message : "Unknown error talking to the backend.");
    }

    function applyEvent(evt: StreamEvent) {
      switch (evt.stage) {
        case "url": {
          if (evt.url_features) setUrlFeatures(evt.url_features);
          setModalityScores((prev) => ({ ...prev, url: evt.score ?? null }));
          advance("url", "done");
          break;
        }
        case "fetch": {
          setFetchInfo({
            finalUrl: evt.final_url ?? "",
            statusCode: evt.status_code ?? 0,
            pageTitle: evt.page_title ?? "",
            fetchDurationMs: evt.fetch_duration_ms ?? 0,
          });
          if (evt.html_preview != null) {
            setFetchedHtml({
              content: evt.html_preview,
              fullLength: evt.html_length ?? evt.html_preview.length,
              truncated: (evt.html_length ?? 0) > evt.html_preview.length,
            });
          }
          advance("fetch", "done");
          break;
        }
        case "html": {
          if (evt.html_features) setHtmlFeatures(evt.html_features);
          if (evt.score == null) {
            setModalitySkipReason((prev) => ({ ...prev, html: evt.skipped }));
            advance("html", "skipped");
          } else {
            setModalityScores((prev) => ({ ...prev, html: evt.score }));
            advance("html", "done");
          }
          break;
        }
        case "text": {
          if (evt.word_count != null) setTextWordCount(evt.word_count);
          if (evt.text_preview != null) {
            setExtractedText({
              content: evt.text_preview,
              fullLength: evt.text_length ?? evt.text_preview.length,
              truncated: (evt.text_length ?? 0) > evt.text_preview.length,
            });
          }
          if (evt.score == null) {
            setModalitySkipReason((prev) => ({ ...prev, text: evt.skipped }));
            advance("text", "skipped");
          } else {
            setModalityScores((prev) => ({ ...prev, text: evt.score }));
            advance("text", "done");
          }
          break;
        }
        case "vision": {
          if (evt.embedding_dim != null && evt.backbone) {
            setVisionInfo({ embeddingDim: evt.embedding_dim, backbone: evt.backbone });
          }
          if (evt.score == null) {
            setModalitySkipReason((prev) => ({ ...prev, vision: evt.skipped }));
            advance("vision", "skipped");
          } else {
            setModalityScores((prev) => ({ ...prev, vision: evt.score }));
            advance("vision", "done");
          }
          break;
        }
        case "fusion": {
          setFusion({
            probability: evt.phishing_probability ?? null,
            label: evt.predicted_label ?? null,
            strategy: evt.fusion_strategy ?? null,
            fetchedFrom: evt.fetched_from ?? null,
            threshold: evt.threshold ?? 0.5,
            requestId: evt.request_id ?? null,
            durationMs: evt.scan_duration_ms ?? null,
            scanId: evt.scan_id ?? null,
          });
          advance("fusion", "done");
          break;
        }
        case "error": {
          setError(evt.message ?? "The backend refused the request.");
          setPhase("error");
          setStepStatus((prev) => {
            const next = { ...prev };
            const activeStep = localOrder.find((s) => next[s] === "active");
            if (activeStep) next[activeStep] = "error";
            return next;
          });
          break;
        }
        default:
          break;
      }
    }
  }, []);

  return {
    phase,
    scannedUrl,
    stepOrder,
    stepStatus,
    stepLabels: STEP_LABELS,
    modalityScores,
    modalitySkipReason,
    urlFeatures,
    htmlFeatures,
    fetchInfo,
    fetchedHtml,
    extractedText,
    textWordCount,
    visionInfo,
    fusion,
    error,
    start,
    reset,
  };
}
