import { Link } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { useErrorAnalysis } from "../hooks/useErrorAnalysis";
import { pct } from "../lib/format";
import { NavIcon } from "../components/layout/NavIcon";

const CARDS = [
  {
    to: "/models",
    icon: "models" as const,
    title: "Model comparison",
    description: "Accuracy, precision, recall, F1, ROC-AUC and PR-AUC for each modality and the fusion model.",
  },
  {
    to: "/research/ablation",
    icon: "layers" as const,
    title: "Ablation study",
    description: "How much accuracy fusion loses when each modality is removed — real contribution, not standalone accuracy.",
  },
  {
    to: "/research/errors",
    icon: "alert" as const,
    title: "Error analysis",
    description: "False positives and false negatives from the offline test set, with per-modality breakdowns.",
  },
  {
    to: "/research/explainability",
    icon: "eye" as const,
    title: "Explainability",
    description: "Feature attribution for individual predictions — status of what's currently available.",
  },
];

export default function ResearchOverviewPage() {
  const { data: modelInfo } = useModelInfo();
  const { data: errorData } = useErrorAnalysis(1);

  const full = modelInfo?.ablation.full;

  return (
    <div className="min-w-0 space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">Research &amp; insights</h1>
        <p className="mt-1 max-w-xl text-sm text-mist-400">
          Why the models behave the way they do — evaluation, ablation, failure cases and explainability, kept
          separate from the live scanner.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryTile label="Multimodal accuracy" value={full ? pct(full.accuracy, 1) : "—"} />
        <SummaryTile label="Test-set errors" value={errorData ? `${errorData.n_errors} / ${errorData.n_test_samples}` : "—"} />
        <SummaryTile
          label="Top contributor"
          value={modelInfo?.priority?.[0] ? modelInfo.priority[0].modality.toUpperCase() : "—"}
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="surface min-w-0 px-5 py-5 transition-transform hover:-translate-y-0.5 hover:shadow-glass"
          >
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-signal-scan/10 text-signal-scanSoft">
                <NavIcon name={c.icon} />
              </span>
              <p className="font-display text-sm font-semibold text-mist-100">{c.title}</p>
            </div>
            <p className="mt-2.5 text-xs leading-relaxed text-mist-400">{c.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-tight min-w-0 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-mist-500">{label}</p>
      <p className="tabular mt-1 truncate font-display text-xl font-semibold text-mist-100">{value}</p>
    </div>
  );
}
