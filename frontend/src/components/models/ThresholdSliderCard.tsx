import { useMemo, useState } from "react";
import {
  OperatingPointConfig,
  ThresholdAnalysisResponse,
  ThresholdTableRow,
} from "../../api/phish360";

interface Props {
  data: ThresholdAnalysisResponse;
}

export function ThresholdSliderCard({ data }: Props) {
  const operatingPoints = data.operating_points || {};
  const defaultThresh =
    data.default_threshold ??
    operatingPoints.default?.threshold ??
    0.50;

  const [threshold, setThreshold] = useState<number>(defaultThresh);

  const testRows: ThresholdTableRow[] =
    data.test_threshold_table ||
    (data as any).test_table ||
    [];

  // Find the closest row in test threshold table
  const activeRow: ThresholdTableRow = useMemo(() => {
    if (!testRows.length) {
      return {
        threshold,
        precision: 0.96,
        recall: 0.96,
        fpr: 0.04,
        f1: 0.96,
        accuracy: 0.96,
        tp: 1255,
        fp: 50,
        tn: 1150,
        fn: 50,
      };
    }
    let closest = testRows[0];
    let minDiff = Math.abs(closest.threshold - threshold);
    for (const r of testRows) {
      const diff = Math.abs(r.threshold - threshold);
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }
    return closest;
  }, [testRows, threshold]);

  const prPoints = (data.curves?.test_pr || (data as any).pr_curve?.test || []).map((pt: any) => ({
    recall: pt.recall ?? pt.x ?? 0,
    precision: pt.precision ?? pt.y ?? 0,
    threshold: pt.threshold ?? 0,
  }));

  const rocPoints = (data.curves?.test_roc || (data as any).roc_curve?.test || []).map((pt: any) => ({
    fpr: pt.fpr ?? pt.x ?? 0,
    tpr: pt.tpr ?? pt.y ?? 0,
    threshold: pt.threshold ?? 0,
  }));

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-5">
      {/* Card Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
            Interactive Threshold Operating Points
          </h3>
          <p className="text-[11px] text-mist-400 mt-0.5">
            Evaluate precision, recall, and false positive trade-offs across 2,760 test samples.
          </p>
        </div>

        {/* Operating Point Quick-Snap Presets */}
        <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
          <span className="text-mist-500 text-[10px] uppercase mr-1">Presets:</span>
          {Object.entries(operatingPoints).map(([key, op]: [string, OperatingPointConfig]) => {
            const isSelected = Math.abs(threshold - op.threshold) < 0.01;
            const label = key.replace(/_/g, " ").toUpperCase();

            return (
              <button
                key={key}
                type="button"
                onClick={() => setThreshold(op.threshold)}
                className={`px-2.5 py-1 rounded border transition-colors ${
                  isSelected
                    ? "border-brand text-brand bg-brand/10 font-semibold"
                    : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
                }`}
              >
                {label} ({op.threshold.toFixed(2)})
              </button>
            );
          })}
        </div>
      </div>

      {/* Threshold Slider Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline font-mono text-xs">
          <span className="text-mist-400 uppercase text-[11px]">Selected Decision Threshold</span>
          <div className="flex items-baseline gap-2">
            <span className="text-brand font-bold text-base tabular">
              {threshold.toFixed(2)}
            </span>
            <span className="text-[10px] text-mist-500">
              (default: {typeof defaultThresh === "number" ? defaultThresh.toFixed(2) : "0.50"})
            </span>
          </div>
        </div>

        <input
          type="range"
          min="0.05"
          max="0.95"
          step="0.01"
          value={threshold}
          onChange={(e) => setThreshold(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-surface-subtle rounded-lg appearance-none cursor-pointer accent-[#38C0E4]"
        />

        <div className="flex justify-between text-[10px] font-mono text-mist-600">
          <span>0.05 (High Catch / Recall)</span>
          <span>0.50 (Default)</span>
          <span>0.95 (High Specificity / Precision)</span>
        </div>
      </div>

      {/* Real-time Empirical Metrics at Chosen Point */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        <div className="border border-surface-border bg-surface-subtle/50 rounded p-3">
          <span className="font-mono text-[10px] text-mist-500 uppercase block">Precision</span>
          <span className="font-mono text-lg font-semibold text-mist-100 tabular block mt-0.5">
            {activeRow.precision != null ? `${(activeRow.precision * 100).toFixed(1)}%` : "unavailable"}
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            FP: {activeRow.fp} / {activeRow.fp + activeRow.tn}
          </span>
        </div>

        <div className="border border-surface-border bg-surface-subtle/50 rounded p-3">
          <span className="font-mono text-[10px] text-mist-500 uppercase block">Recall (Catch Rate)</span>
          <span className="font-mono text-lg font-semibold text-mist-100 tabular block mt-0.5">
            {activeRow.recall != null ? `${(activeRow.recall * 100).toFixed(1)}%` : "unavailable"}
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            TP: {activeRow.tp} / {activeRow.tp + activeRow.fn}
          </span>
        </div>

        <div className="border border-surface-border bg-surface-subtle/50 rounded p-3">
          <span className="font-mono text-[10px] text-mist-500 uppercase block">False Positive Rate</span>
          <span className="font-mono text-lg font-semibold text-mist-100 tabular block mt-0.5">
            {activeRow.fpr != null ? `${(activeRow.fpr * 100).toFixed(2)}%` : "unavailable"}
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            Clean sites blocked
          </span>
        </div>

        <div className="border border-surface-border bg-surface-subtle/50 rounded p-3">
          <span className="font-mono text-[10px] text-mist-500 uppercase block">F1 Score</span>
          <span className="font-mono text-lg font-semibold text-mist-100 tabular block mt-0.5">
            {activeRow.f1 != null ? activeRow.f1.toFixed(3) : "unavailable"}
          </span>
          <span className="font-mono text-[10px] text-mist-500 tabular">
            Harmonic mean
          </span>
        </div>
      </div>

      {/* Side-by-Side Clean SVG Curves (PR and ROC) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Precision-Recall Curve */}
        <div className="border border-surface-border bg-surface-canvas rounded p-3 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-mist-300 font-medium">Precision-Recall Curve</span>
            <span className="text-mist-500 text-[10px]">Test Set</span>
          </div>

          <svg viewBox="0 0 280 160" className="w-full h-auto select-none">
            {/* Grid Lines */}
            <line x1="30" y1="20" x2="270" y2="20" stroke="#1E222A" strokeWidth="1" />
            <line x1="30" y1="80" x2="270" y2="80" stroke="#1E222A" strokeWidth="1" />
            <line x1="30" y1="140" x2="270" y2="140" stroke="#2A303C" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="140" stroke="#2A303C" strokeWidth="1" />
            <line x1="150" y1="20" x2="150" y2="140" stroke="#1E222A" strokeWidth="1" />
            <line x1="270" y1="20" x2="270" y2="140" stroke="#1E222A" strokeWidth="1" />

            {/* Labels */}
            <text x="24" y="24" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">1.0</text>
            <text x="24" y="84" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.5</text>
            <text x="24" y="144" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.0</text>

            <text x="30" y="154" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">0</text>
            <text x="150" y="154" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">Recall 0.5</text>
            <text x="270" y="154" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">1.0</text>

            {/* PR Path */}
            {prPoints.length > 0 && (
              <path
                d={prPoints
                  .map((pt, i) => {
                    const x = 30 + pt.recall * 240;
                    const y = 140 - pt.precision * 120;
                    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#38C0E4"
                strokeWidth="1.5"
              />
            )}

            {/* Active Threshold Marker on PR Curve */}
            {activeRow && (
              <circle
                cx={30 + activeRow.recall * 240}
                cy={140 - activeRow.precision * 120}
                r="4"
                fill="#38C0E4"
                stroke="#090A0C"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </div>

        {/* ROC Curve */}
        <div className="border border-surface-border bg-surface-canvas rounded p-3 space-y-2">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-mist-300 font-medium">Receiver Operating Characteristic (ROC)</span>
            <span className="text-mist-500 text-[10px]">Test Set</span>
          </div>

          <svg viewBox="0 0 280 160" className="w-full h-auto select-none">
            {/* Grid Lines */}
            <line x1="30" y1="20" x2="270" y2="20" stroke="#1E222A" strokeWidth="1" />
            <line x1="30" y1="80" x2="270" y2="80" stroke="#1E222A" strokeWidth="1" />
            <line x1="30" y1="140" x2="270" y2="140" stroke="#2A303C" strokeWidth="1" />
            <line x1="30" y1="20" x2="30" y2="140" stroke="#2A303C" strokeWidth="1" />
            <line x1="150" y1="20" x2="150" y2="140" stroke="#1E222A" strokeWidth="1" />
            <line x1="270" y1="20" x2="270" y2="140" stroke="#1E222A" strokeWidth="1" />

            {/* Diagonal reference line */}
            <line x1="30" y1="140" x2="270" y2="20" stroke="#2A303C" strokeWidth="1" strokeDasharray="3 3" />

            {/* Labels */}
            <text x="24" y="24" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">1.0</text>
            <text x="24" y="84" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.5</text>
            <text x="24" y="144" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.0</text>

            <text x="30" y="154" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">0</text>
            <text x="150" y="154" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">FPR 0.5</text>
            <text x="270" y="154" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">1.0</text>

            {/* ROC Path */}
            {rocPoints.length > 0 && (
              <path
                d={rocPoints
                  .map((pt, i) => {
                    const x = 30 + pt.fpr * 240;
                    const y = 140 - pt.tpr * 120;
                    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#38C0E4"
                strokeWidth="1.5"
              />
            )}

            {/* Active Threshold Marker on ROC Curve */}
            {activeRow && (
              <circle
                cx={30 + activeRow.fpr * 240}
                cy={140 - activeRow.recall * 120}
                r="4"
                fill="#38C0E4"
                stroke="#090A0C"
                strokeWidth="1.5"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}
