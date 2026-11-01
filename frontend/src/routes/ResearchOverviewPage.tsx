import { Link } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { useErrorAnalysis } from "../hooks/useErrorAnalysis";
import { pct } from "../lib/format";

const RESEARCH_CARDS = [
  {
    to: "/models",
    title: "Model Forensics & Performance",
    description: "Empirical precision, recall, ROC-AUC, threshold operating points, and decile calibration curves.",
  },
  {
    to: "/research/ablation",
    title: "Ablation Forensics",
    description: "Accuracy lost when modalities are removed from fusion — isolating real multimodal contribution.",
  },
  {
    to: "/research/errors",
    title: "Error Analysis",
    description: "False positives and false negatives from the held-out test split with per-modality probabilities.",
  },
  {
    to: "/research/explainability",
    title: "Explainability & Attribution",
    description: "TreeSHAP game-theoretic feature attributions for URL & DOM and linear n-gram TF-IDF weights.",
  },
];

export default function ResearchOverviewPage() {
  const { data: modelInfo } = useModelInfo();
  const { data: errorData } = useErrorAnalysis(1);

  const full = modelInfo?.ablation.full;

  return (
    <div className="min-w-0 space-y-6 font-sans">
      {/* Header */}
      <div className="border border-surface-border bg-surface-card rounded-lg p-5">
        <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest block mb-1">
          Forensic Methodology
        </span>
        <h1 className="font-mono text-lg font-semibold text-mist-100">
          Research & Evaluation Insights
        </h1>
        <p className="text-xs text-mist-400 mt-0.5 max-w-2xl">
          Empirical evaluation methodology, failure case taxonomy, and model attribution mechanics for the Phish360 multimodal pipeline.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="border border-surface-border bg-surface-card rounded-lg p-4 font-mono">
          <span className="text-[10px] text-mist-500 uppercase block">Multimodal Test Accuracy</span>
          <span className="text-xl font-semibold text-mist-100 tabular block mt-1">
            {full ? pct(full.accuracy, 2) : "—"}
          </span>
          <span className="text-[10px] text-mist-500">Held-out test set (N=600)</span>
        </div>

        <div className="border border-surface-border bg-surface-card rounded-lg p-4 font-mono">
          <span className="text-[10px] text-mist-500 uppercase block">Total Test Errors</span>
          <span className="text-xl font-semibold text-mist-100 tabular block mt-1">
            {errorData ? `${errorData.n_errors} / ${errorData.n_test_samples}` : "—"}
          </span>
          <span className="text-[10px] text-mist-500">
            {errorData ? `${((errorData.n_errors / errorData.n_test_samples) * 100).toFixed(2)}% error rate` : "—"}
          </span>
        </div>

        <div className="border border-surface-border bg-surface-card rounded-lg p-4 font-mono">
          <span className="text-[10px] text-mist-500 uppercase block">Top Fusion Anchor</span>
          <span className="text-xl font-semibold text-brand tabular block mt-1 uppercase">
            {modelInfo?.priority?.[0] ? modelInfo.priority[0].modality : "TEXT / URL"}
          </span>
          <span className="text-[10px] text-mist-500">Highest ablation penalty</span>
        </div>
      </div>

      {/* Research Section Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {RESEARCH_CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="border border-surface-border bg-surface-card rounded-lg p-5 hover:border-brand/40 transition-colors block group"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-mono text-xs font-semibold text-mist-200 group-hover:text-brand transition-colors uppercase tracking-wider">
                {c.title}
              </h3>
              <span className="font-mono text-xs text-mist-500 group-hover:text-brand">→</span>
            </div>
            <p className="text-xs text-mist-400 leading-relaxed font-sans">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
