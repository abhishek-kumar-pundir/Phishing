import { Link } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { EmptyState } from "../components/ui/EmptyState";
import { AblationBars, PriorityRanking } from "../components/research/AblationBars";
import { ArrowLeft } from "../components/ui/Glyphs";

export default function ResearchAblationPage() {
  const { data, loading, error } = useModelInfo();

  return (
    <div className="min-w-0 space-y-5 font-sans">
      <Link
        to="/research"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-mist-400 hover:text-mist-100 transition-colors"
      >
        <ArrowLeft size={14} />
        Research overview
      </Link>

      <div className="border border-surface-border bg-surface-card rounded-lg p-5">
        <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest block mb-1">
          Sensitivity Analysis
        </span>
        <h1 className="font-mono text-lg font-semibold text-mist-100">
          Ablation Study
        </h1>
        <p className="text-xs text-mist-400 mt-0.5 max-w-2xl">
          Modality importance is measured directly by removing each input stream from the multimodal fusion model and observing test degradation.
        </p>
      </div>

      {loading && (
        <div className="p-12 text-center font-mono text-xs text-mist-500">
          Loading ablation results…
        </div>
      )}

      {!loading && (error || !data) && (
        <EmptyState
          tone="danger"
          title="Unable to load ablation data"
          description={error ?? "Ablation metrics could not be fetched."}
        />
      )}

      {!loading && data && (
        <div className="space-y-5">
          <AblationBars ablation={data.ablation} />
          <PriorityRanking priority={data.priority} />
        </div>
      )}
    </div>
  );
}
