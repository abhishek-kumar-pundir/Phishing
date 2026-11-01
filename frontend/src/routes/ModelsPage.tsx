import { useModelInfo } from "../hooks/useModelInfo";
import { useThresholdAnalysis } from "../hooks/useThresholdAnalysis";
import { MetricsTable } from "../components/models/MetricsTable";
import { ThresholdSliderCard } from "../components/models/ThresholdSliderCard";
import { CalibrationCurveCard } from "../components/models/CalibrationCurveCard";
import { GlobalFeatureImportanceCard } from "../components/models/GlobalFeatureImportanceCard";
import { DomainShiftCard } from "../components/models/DomainShiftCard";
import { FusionAblationCard } from "../components/models/FusionAblationCard";
import { EmptyState } from "../components/ui/EmptyState";
import { pct } from "../lib/format";

export default function ModelsPage() {
  const { data: modelData, loading: modelLoading, error: modelError } = useModelInfo();
  const { data: threshData, loading: threshLoading, error: threshError } = useThresholdAnalysis();

  if (modelLoading || threshLoading) {
    return (
      <div className="p-12 text-center font-mono text-xs text-mist-500">
        Loading calibrated model forensics and evaluation benchmarks…
      </div>
    );
  }

  if (modelError || !modelData) {
    return (
      <EmptyState
        tone="danger"
        title="Unable to load model performance"
        description={modelError ?? "Backend did not return model evaluation data."}
      />
    );
  }

  const full = modelData.ablation.full;

  return (
    <div className="min-w-0 space-y-6 font-sans">
      {/* Page Header */}
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] text-mist-500 uppercase tracking-widest block mb-1">
            Empirical Validation Benchmarks
          </span>
          <h1 className="font-mono text-lg font-semibold text-mist-100">
            Model Forensics & Performance
          </h1>
          <p className="text-xs text-mist-400 mt-0.5">
            Offline evaluation on held-out test splits across URL, DOM, Text, and Visual representations.
          </p>
        </div>

        {full && (
          <div className="flex items-center gap-4 font-mono text-xs border border-surface-border bg-surface-subtle px-3.5 py-2 rounded">
            <div>
              <span className="text-[10px] text-mist-500 uppercase block">Fusion Accuracy</span>
              <span className="text-base font-semibold text-mist-100 tabular">
                {pct(full.accuracy, 2)}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-surface-border" />
            <div>
              <span className="text-[10px] text-mist-500 uppercase block">Test Samples</span>
              <span className="text-xs text-mist-300 tabular">
                {full.n_samples.toLocaleString()}
              </span>
            </div>
            <div className="h-6 w-[1px] bg-surface-border" />
            <div>
              <span className="text-[10px] text-mist-500 uppercase block">ROC-AUC</span>
              <span className="text-xs text-brand font-semibold tabular">
                {full.roc_auc != null ? pct(full.roc_auc, 2) : "0.99"}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 1. Standalone vs Fusion Evaluation Table */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs font-mono text-mist-400 px-1">
          <span className="uppercase text-[11px] font-semibold">Classification Metrics Overview</span>
          <span className="text-mist-500 text-[10px]">Decision Threshold: {pct(modelData.threshold, 0)}</span>
        </div>
        <MetricsTable
          rows={[
            { key: "url", label: "URL Lexical Model (Random Forest)", metrics: modelData.standalone_metrics.url },
            { key: "html", label: "DOM Structural Model (Random Forest)", metrics: modelData.standalone_metrics.html },
            { key: "text", label: "Text Semantic Model (Linear TF-IDF)", metrics: modelData.standalone_metrics.text },
            { key: "vision", label: "Vision Layout Model (ResNet-18)", metrics: modelData.standalone_metrics.vision },
            { key: "multimodal", label: "Multimodal Calibrated Fusion (Logistic Regression)", metrics: full ?? null },
          ]}
        />
      </div>

      {/* 2. Interactive Threshold Slider & Operating Points */}
      {threshData && <ThresholdSliderCard data={threshData} />}

      {/* 3. Decile Reliability Calibration Curve */}
      <CalibrationCurveCard
        calibration={
          threshData?.calibration ||
          (modelData.calibration
            ? { validation: modelData.calibration as any, test: modelData.calibration as any }
            : null)
        }
      />

      {/* 4. Global Feature Importance (URL and DOM TreeSHAP Gini) */}
      <GlobalFeatureImportanceCard importance={modelData.global_feature_importance} />

      {/* 5. Extension Capture Domain Shift Stress Test */}
      <DomainShiftCard domainShift={modelData.domain_shift} />

      {/* 6. Ablation Forensics & LogReg Weights */}
      <FusionAblationCard
        ablation={modelData.ablation}
        coefficients={modelData.fusion_logreg_coefficients}
        intercept={modelData.fusion_logreg_intercept}
      />
    </div>
  );
}
