import { useNavigate, useParams } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { EmptyState } from "../components/ui/EmptyState";
import { StatTile } from "../components/ui/StatTile";
import { Tabs } from "../components/ui/Tabs";
import { ConfusionMatrixView } from "../components/models/ConfusionMatrixView";
import { ClassificationReportView } from "../components/models/ClassificationReportView";
import { StandaloneMetric } from "../api/phish360";
import { pct } from "../lib/format";

const MODEL_KEYS = ["url", "html", "text", "vision", "multimodal"] as const;
type ModelKey = (typeof MODEL_KEYS)[number];

const LABELS: Record<ModelKey, string> = { url: "URL", html: "HTML / DOM", text: "Text", vision: "Vision", multimodal: "Multimodal" };

export default function ModelDetailPage() {
  const { model } = useParams<{ model: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useModelInfo();

  const key: ModelKey = MODEL_KEYS.includes(model as ModelKey) ? (model as ModelKey) : "multimodal";

  if (loading) return <EmptyState title="Loading model evaluation…" />;
  if (error || !data) return <EmptyState tone="danger" title="Couldn't load model performance" description={error ?? undefined} />;

  const metrics: StandaloneMetric | null | undefined = key === "multimodal" ? data.ablation.full : data.standalone_metrics[key];

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">{LABELS[key]} model</h1>
        <Tabs
          tabs={MODEL_KEYS.map((k) => ({ key: k, label: LABELS[k] }))}
          active={key}
          onChange={(k) => navigate(`/models/${k}`)}
        />
      </div>

      {!metrics ? (
        <EmptyState title="Not evaluated yet" description="No stored evaluation artifact was found for this model." />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile label="Accuracy" value={pct(metrics.accuracy, 1)} />
            <StatTile label="F1" value={metrics.f1.toFixed(3)} />
            <StatTile label="ROC-AUC" value={pct(metrics.roc_auc, 1)} />
            <StatTile label="PR-AUC" value={pct(metrics.pr_auc, 1)} />
            <StatTile label="Precision" value={pct(metrics.precision, 1)} />
            <StatTile label="Recall" value={pct(metrics.recall, 1)} />
            <StatTile label="Support" value={metrics.n_samples.toLocaleString()} />
            <StatTile label="Threshold" value={pct(metrics.threshold, 0)} />
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="surface min-w-0 px-5 py-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-mist-500">Confusion matrix</p>
              <ConfusionMatrixView cm={metrics.confusion_matrix} />
            </div>
            <div className="surface min-w-0 px-5 py-5">
              <p className="mb-4 text-xs font-medium uppercase tracking-wide text-mist-500">Classification report</p>
              <ClassificationReportView report={metrics.classification_report} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
