import { useModelInfo } from "../hooks/useModelInfo";
import { MetricsTable } from "../components/models/MetricsTable";
import { StatTile } from "../components/ui/StatTile";
import { EmptyState } from "../components/ui/EmptyState";
import { pct } from "../lib/format";
import { Modality } from "../api/phish360";

const MODALITY_LABEL: Record<Modality, string> = { url: "URL", html: "HTML / DOM", text: "Text", vision: "Vision" };

export default function ModelsPage() {
  const { data, loading, error } = useModelInfo();

  if (loading) return <EmptyState title="Loading evaluation data…" />;
  if (error || !data) return <EmptyState tone="danger" title="Couldn't load model performance" description={error ?? undefined} />;

  const full = data.ablation.full;

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">Model performance</h1>
        <p className="mt-1 text-sm text-mist-400">Offline evaluation on the Phish360 held-out test set.</p>
      </div>

      {full && (
        <div className="surface flex flex-col items-center gap-1 px-6 py-8 text-center">
          <p className="text-xs uppercase tracking-wide text-mist-500">Multimodal (fusion)</p>
          <p className="tabular font-display text-4xl font-bold text-signal-safeSoft sm:text-5xl">{pct(full.accuracy, 1)}</p>
          <p className="text-xs text-mist-500">
            F1 {full.f1.toFixed(3)} · {full.n_samples.toLocaleString()} test samples
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(["url", "html", "text", "vision"] as Modality[]).map((m) => (
          <StatTile
            key={m}
            label={MODALITY_LABEL[m]}
            value={data.standalone_metrics[m] ? pct(data.standalone_metrics[m]!.accuracy, 1) : "—"}
            sublabel="standalone accuracy"
          />
        ))}
      </div>

      <MetricsTable
        rows={[
          { key: "url", label: "URL", metrics: data.standalone_metrics.url },
          { key: "html", label: "HTML / DOM", metrics: data.standalone_metrics.html },
          { key: "text", label: "Text", metrics: data.standalone_metrics.text },
          { key: "vision", label: "Vision", metrics: data.standalone_metrics.vision },
          { key: "multimodal", label: "Multimodal (fusion)", metrics: full ?? null },
        ]}
      />

      <p className="text-xs text-mist-500">
        Threshold used everywhere: {pct(data.threshold, 0)}. Click any model to see its confusion matrix and full
        classification report.
      </p>
    </div>
  );
}
