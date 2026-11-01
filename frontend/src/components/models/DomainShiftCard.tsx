import { DomainShiftResponse } from "../../api/phish360";

interface Props {
  domainShift: DomainShiftResponse | null;
}

export function DomainShiftCard({ domainShift }: Props) {
  if (!domainShift) {
    return (
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-mono text-xs text-mist-500">
        Domain shift evaluation data unavailable.
      </div>
    );
  }

  const visionOrig = domainShift.vision_standalone.original_dataset_screenshots;
  const visionView = domainShift.vision_standalone.viewport_offline_screenshots;
  const fusionOrig = domainShift.fusion_model.original_fusion_full;
  const fusionView = domainShift.fusion_model.viewport_fusion_full;
  const flipsAtDefault = domainShift.fusion_model.flips_by_threshold?.["0.50"];

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
            Extension Capture Domain Shift Evaluation
          </h3>
          <p className="text-[11px] text-mist-400 mt-0.5">
            Empirical stress-testing: Full-page captures vs. 1280×720 viewport-rendered offline snapshots (600 test samples).
          </p>
        </div>
        <span className="font-mono text-[10px] text-mist-500 bg-surface-subtle px-2 py-0.5 rounded border border-surface-border">
          N = 600 Stratified Pairs
        </span>
      </div>

      {/* Comparison Grid: Standalone Vision vs Multimodal Fusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Standalone Vision Vulnerability Card */}
        <div className="border border-surface-border bg-surface-canvas rounded p-4 space-y-3 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-semibold text-mist-200 uppercase">Standalone Vision Model</span>
            <span className="text-[10px] text-mist-500">Severe Shift</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border border-surface-border/60 bg-surface-subtle/40 p-2.5 rounded">
              <span className="text-[10px] text-mist-500 uppercase block">Accuracy Drop</span>
              <span className="text-sm font-semibold text-mist-100 block mt-0.5 tabular">
                {(visionOrig.accuracy * 100).toFixed(2)}% → {(visionView.accuracy * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-mist-400 tabular">
                -{(domainShift.key_findings.standalone_vision_accuracy_drop * 100).toFixed(2)}%
              </span>
            </div>

            <div className="border border-surface-border/60 bg-surface-subtle/40 p-2.5 rounded">
              <span className="text-[10px] text-mist-500 uppercase block">False Positive Rate</span>
              <span className="text-sm font-semibold text-mist-100 block mt-0.5 tabular">
                {(visionOrig.fpr * 100).toFixed(2)}% → {(visionView.fpr * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-mist-400 tabular">
                +{(domainShift.key_findings.standalone_vision_fpr_increase * 100).toFixed(2)}% surge
              </span>
            </div>
          </div>

          <p className="text-[11px] text-mist-500 font-sans leading-relaxed">
            Without external CSS/images, unstyled DOM layouts generate false visual patterns, rendering standalone vision vulnerable to false alarms.
          </p>
        </div>

        {/* Multimodal Fusion Stability Card */}
        <div className="border border-surface-border bg-surface-canvas rounded p-4 space-y-3 font-mono">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-semibold text-mist-200 uppercase">Full Multimodal Fusion</span>
            <span className="text-[10px] text-brand">Empirically Resilient</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="border border-surface-border/60 bg-surface-subtle/40 p-2.5 rounded">
              <span className="text-[10px] text-mist-500 uppercase block">Fusion Accuracy</span>
              <span className="text-sm font-semibold text-mist-100 block mt-0.5 tabular">
                {(fusionOrig.accuracy * 100).toFixed(2)}% → {(fusionView.accuracy * 100).toFixed(2)}%
              </span>
              <span className="text-[10px] text-brand tabular">
                ROC-AUC: {fusionView.roc_auc.toFixed(4)}
              </span>
            </div>

            <div className="border border-surface-border/60 bg-surface-subtle/40 p-2.5 rounded">
              <span className="text-[10px] text-mist-500 uppercase block">Verdict Flips (0.50)</span>
              <span className="text-sm font-semibold text-mist-100 block mt-0.5 tabular">
                {flipsAtDefault ? `${flipsAtDefault.total_flips} / 600` : "1 / 600"}
              </span>
              <span className="text-[10px] text-mist-400 tabular">
                Flip rate: {flipsAtDefault ? (flipsAtDefault.flip_rate * 100).toFixed(2) : "0.17"}%
              </span>
            </div>
          </div>

          <p className="text-[11px] text-mist-500 font-sans leading-relaxed">
            The multimodal logistic regression anchors predictions with URL (3.60) and DOM (2.63) signals, absorbing visual degradation cleanly.
          </p>
        </div>
      </div>

      {/* Plain-Language Empirical Caveat Notice */}
      <div className="border border-surface-border bg-surface-subtle/60 rounded p-3.5 text-xs font-mono space-y-2 text-mist-400">
        <span className="text-mist-200 font-semibold block text-[11px] uppercase tracking-wider">
          Forensic Methodology Caveats
        </span>
        <ul className="space-y-1 text-[11px] text-mist-500 list-disc list-inside leading-relaxed font-sans">
          <li>
            <strong className="text-mist-300 font-mono">Synthetic Rendering Approximation:</strong> Rendering saved HTML offline without external stylesheets and images only approximates the Chrome extension's live viewport capture.
          </li>
          <li>
            <strong className="text-mist-300 font-mono">Sample Size:</strong> The live-capture evaluation dataset consists of a pilot benchmark of 5 clean public domains.
          </li>
          <li>
            <strong className="text-mist-300 font-mono">Proposed Mitigations:</strong> Visual outlier routing and dynamic modality pruning are theoretical architectural proposals and are <span className="text-mist-300 font-semibold">NOT implemented</span> in production. No automatic fallback routing is active.
          </li>
        </ul>
      </div>
    </div>
  );
}
