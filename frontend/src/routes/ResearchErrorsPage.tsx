import { useState } from "react";
import { Link } from "react-router-dom";
import { useErrorAnalysis } from "../hooks/useErrorAnalysis";
import { EmptyState } from "../components/ui/EmptyState";
import { ErrorList } from "../components/research/ErrorList";
import { ArrowLeft } from "../components/ui/Glyphs";

export default function ResearchErrorsPage() {
  const { data, loading, error } = useErrorAnalysis(16);
  const [tab, setTab] = useState<"fn" | "fp">("fn");

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
          Failure Diagnostics
        </span>
        <h1 className="font-mono text-lg font-semibold text-mist-100">
          Empirical Error Analysis
        </h1>
        <p className="text-xs text-mist-400 mt-0.5 max-w-2xl">
          Granular investigation into false positives and false negatives on the held-out test split, exposing per-modality prediction conflicts.
        </p>
      </div>

      {loading && (
        <div className="p-12 text-center font-mono text-xs text-mist-500">
          Loading error cases…
        </div>
      )}

      {!loading && (error || !data) && (
        <EmptyState
          tone="danger"
          title="Unable to load error analysis"
          description={error ?? "Error samples could not be retrieved."}
        />
      )}

      {!loading && data && (
        <div className="space-y-4">
          {/* Metrics summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
            <div className="border border-surface-border bg-surface-card rounded-lg p-3.5">
              <span className="text-[10px] text-mist-500 uppercase block">Held-Out Test Samples</span>
              <span className="text-lg font-semibold text-mist-100 tabular block mt-0.5">
                {data.n_test_samples.toLocaleString()}
              </span>
            </div>
            <div className="border border-surface-border bg-surface-card rounded-lg p-3.5">
              <span className="text-[10px] text-mist-500 uppercase block">Total Classification Errors</span>
              <span className="text-lg font-semibold text-verdict-phish tabular block mt-0.5">
                {data.n_errors.toLocaleString()}
              </span>
            </div>
            <div className="border border-surface-border bg-surface-card rounded-lg p-3.5">
              <span className="text-[10px] text-mist-500 uppercase block">Empirical Error Rate</span>
              <span className="text-lg font-semibold text-mist-100 tabular block mt-0.5">
                {((data.n_errors / data.n_test_samples) * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          {/* Error Tabs & List */}
          <div className="border border-surface-border bg-surface-card rounded-lg p-5 space-y-4">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3 font-mono text-xs">
              <button
                type="button"
                onClick={() => setTab("fn")}
                className={`px-3 py-1.5 rounded border transition-colors ${
                  tab === "fn"
                    ? "border-brand text-brand bg-brand/10 font-semibold"
                    : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
                }`}
              >
                False Negatives ({data.false_negatives.length})
              </button>
              <button
                type="button"
                onClick={() => setTab("fp")}
                className={`px-3 py-1.5 rounded border transition-colors ${
                  tab === "fp"
                    ? "border-brand text-brand bg-brand/10 font-semibold"
                    : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
                }`}
              >
                False Positives ({data.false_positives.length})
              </button>
            </div>

            <ErrorList
              examples={tab === "fn" ? data.false_negatives : data.false_positives}
              kind={tab === "fn" ? "false_negative" : "false_positive"}
            />
          </div>
        </div>
      )}
    </div>
  );
}
