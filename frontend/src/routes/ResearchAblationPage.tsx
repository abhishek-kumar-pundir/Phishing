import { useModelInfo } from "../hooks/useModelInfo";
import { EmptyState } from "../components/ui/EmptyState";
import { AblationBars, PriorityRanking } from "../components/research/AblationBars";
import { Link } from "react-router-dom";

export default function ResearchAblationPage() {
  const { data, loading, error } = useModelInfo();

  return (
    <div className="min-w-0 space-y-5">
      <Breadcrumb />
      <div>
        <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">Ablation study</h1>
        <p className="mt-1 max-w-xl text-sm text-mist-400">
          Each modality is removed from fusion one at a time and the resulting accuracy is measured directly —
          nothing here is inferred from standalone model accuracy.
        </p>
      </div>

      {loading && <EmptyState title="Loading ablation results…" />}
      {!loading && (error || !data) && <EmptyState tone="danger" title="Couldn't load ablation data" description={error ?? undefined} />}
      {!loading && data && (
        <>
          <AblationBars ablation={data.ablation} />
          <PriorityRanking priority={data.priority} />
        </>
      )}
    </div>
  );
}

function Breadcrumb() {
  return (
    <Link to="/research" className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-mist-100">
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Research overview
    </Link>
  );
}
