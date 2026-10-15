import { Link } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { EmptyState } from "../components/ui/EmptyState";
import { Modality } from "../api/phish360";

const LABELS: Record<Modality, string> = { url: "URL", html: "HTML / DOM", text: "Text", vision: "Vision" };

export default function ResearchExplainabilityPage() {
  const { data, loading } = useModelInfo();
  const coeffs = data?.fusion_logreg_coefficients;

  return (
    <div className="min-w-0 space-y-5">
      <Link to="/research" className="inline-flex items-center gap-1.5 text-xs text-mist-400 hover:text-mist-100">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Research overview
      </Link>

      <div>
        <h1 className="font-display text-xl font-semibold text-mist-100 sm:text-2xl">Explainability</h1>
        <p className="mt-1 max-w-xl text-sm text-mist-400">
          What actually drives the fusion decision, and an honest status on what's not available yet.
        </p>
      </div>

      {loading && <EmptyState title="Loading…" />}

      {!loading && coeffs && (
        <div className="surface min-w-0 px-5 py-5">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-mist-500">
            Fusion model — logistic regression weights
          </p>
          <p className="mb-4 text-[11px] text-mist-500">
            The fusion model is a logistic regression over the four modality scores. These are its real fitted
            coefficients — a larger magnitude means that modality's score moves the final decision more per unit change.
          </p>
          <div className="space-y-3">
            {(Object.entries(coeffs) as [Modality, number][]).map(([m, w]) => {
              const maxAbs = Math.max(...Object.values(coeffs).map((v) => Math.abs(v)), 0.001);
              const widthPct = (Math.abs(w) / maxAbs) * 100;
              return (
                <div key={m} className="flex min-w-0 items-center gap-3">
                  <span className="w-16 shrink-0 text-xs font-medium uppercase text-mist-300">{LABELS[m]}</span>
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                      className={`h-full rounded-full ${w >= 0 ? "bg-signal-danger/70" : "bg-signal-safe/70"}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="tabular w-16 shrink-0 text-right text-xs text-mist-300">
                    {w >= 0 ? "+" : ""}
                    {w.toFixed(3)}
                  </span>
                </div>
              );
            })}
          </div>
          {data?.fusion_logreg_intercept != null && (
            <p className="mt-4 text-[11px] text-mist-500">Intercept: {data.fusion_logreg_intercept.toFixed(3)}</p>
          )}
        </div>
      )}

      <EmptyState
        title="Per-sample SHAP and Grad-CAM aren't available yet"
        description="The backend doesn't currently expose a per-prediction feature-attribution endpoint for the URL/HTML/Text models, or a Grad-CAM heatmap endpoint for the vision model. Rather than fabricate one, this page shows only the fusion weights above until those endpoints exist."
      />
    </div>
  );
}
