import { Link } from "react-router-dom";
import { useModelInfo } from "../hooks/useModelInfo";
import { GlobalFeatureImportanceCard } from "../components/models/GlobalFeatureImportanceCard";
import { EmptyState } from "../components/ui/EmptyState";
import { ArrowLeft } from "../components/ui/Glyphs";

const MODALITY_NAMES: Record<string, string> = {
  url: "URL Lexical Model (Random Forest)",
  html: "DOM Structure Model (Random Forest)",
  text: "Text Semantic Model (Linear TF-IDF)",
  vision: "Visual Layout Model (ResNet-18)",
};

export default function ResearchExplainabilityPage() {
  const { data, loading, error } = useModelInfo();
  const coeffs = data?.fusion_logreg_coefficients;

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
          Forensic Interpretability
        </span>
        <h1 className="font-mono text-lg font-semibold text-mist-100">
          Model Explainability & Feature Attribution
        </h1>
        <p className="text-xs text-mist-400 mt-0.5 max-w-2xl">
          Game-theoretic TreeSHAP feature attributions and linear TF-IDF coefficients explaining why individual samples and models trigger phishing verdicts.
        </p>
      </div>

      {loading && (
        <div className="p-12 text-center font-mono text-xs text-mist-500">
          Loading explainability metrics…
        </div>
      )}

      {!loading && (error || !data) && (
        <EmptyState
          tone="danger"
          title="Unable to load explainability data"
          description={error ?? "Feature importance could not be retrieved."}
        />
      )}

      {!loading && data && (
        <div className="space-y-5">
          {/* Global Feature Importance Card */}
          <GlobalFeatureImportanceCard importance={data.global_feature_importance} />

          {/* Fusion Meta-Classifier Weights */}
          {coeffs && (
            <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-4">
              <div className="border-b border-surface-border pb-3 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
                    Multimodal Logistic Regression Weights
                  </h3>
                  <p className="text-[11px] text-mist-400 mt-0.5">
                    Fitted linear coefficients determining the relative impact of each modality's probability score.
                  </p>
                </div>
                {data.fusion_logreg_intercept != null && (
                  <span className="font-mono text-[10px] text-mist-500 bg-surface-subtle px-2 py-0.5 rounded border border-surface-border">
                    Intercept: {data.fusion_logreg_intercept.toFixed(4)}
                  </span>
                )}
              </div>

              <div className="space-y-3 font-mono text-xs">
                {Object.entries(coeffs).map(([mod, coef]) => {
                  const total = 3.5985 + 2.6307 + 4.9169 + 1.2024;
                  const pctWeight = ((coef / total) * 100).toFixed(1);

                  return (
                    <div key={mod} className="space-y-1">
                      <div className="flex justify-between items-baseline text-[11px]">
                        <span className="text-mist-200">
                          {MODALITY_NAMES[mod] || mod}
                        </span>
                        <div className="flex items-center gap-2 tabular">
                          <span className="text-mist-400">coef: {coef.toFixed(4)}</span>
                          <span className="text-brand font-semibold text-[10px]">
                            ({pctWeight}% weight)
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand rounded-full"
                          style={{ width: `${pctWeight}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-surface-border pt-3 text-[11px] font-mono text-mist-500 leading-relaxed font-sans">
                <strong>Honesty in Attribution:</strong> SHAP and linear coefficients mathematically explain model decision logic and training set weights. They do not constitute absolute proof or real-world ground truth.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
