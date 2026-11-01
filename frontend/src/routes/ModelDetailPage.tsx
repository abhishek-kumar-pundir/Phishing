import { Link, useNavigate, useParams } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfusionMatrixView } from "../components/models/ConfusionMatrixView";
import { ClassificationReportView } from "../components/models/ClassificationReportView";
import { StandaloneMetric } from "../api/phish360";
import { pct } from "../lib/format";
import { ArrowLeft } from "../components/ui/Glyphs";

const MODEL_KEYS = ["url", "html", "text", "vision", "multimodal"] as const;
type ModelKey = (typeof MODEL_KEYS)[number];

const LABELS: Record<ModelKey, string> = {
  url: "URL Lexical Model",
  html: "DOM Structural Model",
  text: "Text Semantic Model",
  vision: "Visual Appearance Model",
  multimodal: "Multimodal Fusion Pipeline",
};

export default function ModelDetailPage() {
  const { model } = useParams<{ model: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useModelInfo();

  const key: ModelKey = MODEL_KEYS.includes(model as ModelKey) ? (model as ModelKey) : "multimodal";

  if (loading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-mist-500">
        Loading model performance details…
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        tone="danger"
        title="Unable to load model performance"
        description={error ?? "Evaluation metrics could not be fetched."}
      />
    );
  }

  const metrics: StandaloneMetric | null | undefined =
    key === "multimodal" ? data.ablation.full : data.standalone_metrics[key];

  return (
    <div className="min-w-0 space-y-5 font-sans">
      <Link
        to="/models"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-mist-400 hover:text-mist-100 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to all models
      </Link>

      {/* Model Selector Bar */}
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest block mb-1">
            Model Forensics
          </span>
          <h1 className="font-mono text-lg font-semibold text-mist-100">
            {LABELS[key]}
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 font-mono text-xs">
          {MODEL_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => navigate(`/models/${k}`)}
              className={`px-3 py-1.5 rounded border transition-colors ${
                key === k
                  ? "border-brand text-brand bg-brand/10 font-semibold"
                  : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
              }`}
            >
              {k.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {!metrics ? (
        <EmptyState
          title="Not evaluated yet"
          description="No stored evaluation artifact was found for this model."
        />
      ) : (
        <>
          {/* Key Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <MetricTile label="Accuracy" value={pct(metrics.accuracy, 2)} />
            <MetricTile label="F1 Score" value={metrics.f1.toFixed(3)} />
            <MetricTile label="ROC-AUC" value={pct(metrics.roc_auc, 2)} />
            <MetricTile label="PR-AUC" value={pct(metrics.pr_auc, 2)} />
            <MetricTile label="Precision" value={pct(metrics.precision, 2)} />
            <MetricTile label="Recall" value={pct(metrics.recall, 2)} />
            <MetricTile label="Support" value={metrics.n_samples.toLocaleString()} />
            <MetricTile label="Operating Threshold" value={pct(metrics.threshold, 0)} />
          </div>

          {/* Matrix & Report */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 border border-surface-border bg-surface-card rounded-lg p-5 space-y-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100 block border-b border-surface-border pb-2">
                Confusion Matrix
              </span>
              <ConfusionMatrixView cm={metrics.confusion_matrix} />
            </div>

            <div className="lg:col-span-7 border border-surface-border bg-surface-card rounded-lg p-5 space-y-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100 block border-b border-surface-border pb-2">
                Classification Report
              </span>
              <ClassificationReportView report={metrics.classification_report} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-surface-border bg-surface-card rounded p-3">
      <span className="text-[10px] uppercase text-mist-500 block">{label}</span>
      <span className="text-base font-semibold text-mist-100 block mt-0.5 tabular">{value}</span>
    </div>
  );
}
