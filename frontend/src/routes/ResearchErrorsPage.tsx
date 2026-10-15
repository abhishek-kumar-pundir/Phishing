import { useState } from "react";
import { Link } from "react-router-dom";
import { useErrorAnalysis } from "../hooks/useErrorAnalysis";
import { EmptyState } from "../components/ui/EmptyState";
import { StatTile } from "../components/ui/StatTile";
import { Tabs } from "../components/ui/Tabs";
import { ErrorList } from "../components/research/ErrorList";

export default function ResearchErrorsPage() {
  const { data, loading, error } = useErrorAnalysis(12);
  const [tab, setTab] = useState<"fp" | "fn">("fn");

  return (
    <div className="min-w-0 space-y-5">
      <Link to="/research" className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-mist-100">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Research overview
      </Link>

      <div>
        <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">Error analysis</h1>
        <p className="mt-1 max-w-xl text-sm text-mist-400">
          Misclassified samples from the offline held-out test set, reconstructed from the fitted fusion model.
        </p>
      </div>

      {loading && <EmptyState title="Loading error analysis…" />}
      {!loading && (error || !data) && (
        <EmptyState tone="danger" title="Couldn't load error analysis" description={error ?? undefined} />
      )}

      {!loading && data && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile label="Test samples" value={data.n_test_samples.toLocaleString()} />
            <StatTile label="Misclassified" value={data.n_errors.toLocaleString()} tone="danger" />
            <StatTile label="Error rate" value={`${((data.n_errors / data.n_test_samples) * 100).toFixed(1)}%`} />
          </div>

          <div className="surface min-w-0 px-5 py-5">
            <Tabs
              tabs={[
                { key: "fn", label: `False negatives (${data.false_negatives.length})` },
                { key: "fp", label: `False positives (${data.false_positives.length})` },
              ]}
              active={tab}
              onChange={(k) => setTab(k as "fp" | "fn")}
            />
            <div className="mt-4">
              {tab === "fn" ? (
                <ErrorList examples={data.false_negatives} kind="false_negative" />
              ) : (
                <ErrorList examples={data.false_positives} kind="false_positive" />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
