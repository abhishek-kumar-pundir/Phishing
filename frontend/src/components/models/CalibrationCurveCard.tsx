import { CalibrationSplitMetrics, CalibrationBin, CalibrationPayload } from "../../api/phish360";

interface Props {
  calibration:
    | CalibrationPayload
    | {
        validation: CalibrationSplitMetrics;
        test: CalibrationSplitMetrics;
      }
    | null;
}

export function CalibrationCurveCard({ calibration }: Props) {
  if (!calibration) {
    return (
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-mono text-xs text-mist-500">
        Calibration metrics unavailable.
      </div>
    );
  }

  // Safely extract the test split or root calibration object
  const testCal: Partial<CalibrationSplitMetrics> | null =
    "test" in calibration && calibration.test
      ? calibration.test
      : (calibration as Partial<CalibrationSplitMetrics>);

  if (!testCal) {
    return (
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-mono text-xs text-mist-500">
        Calibration test split unavailable.
      </div>
    );
  }

  const rawBins: CalibrationBin[] = testCal.bins || testCal.reliability_bins || [];
  const bins = rawBins.map((b: any) => ({
    count: b.count ?? 0,
    mean_predicted: b.confidence ?? b.mean_predicted ?? 0,
    observed_fraction: b.accuracy ?? b.observed_fraction ?? 0,
    bin_lower: b.bin_lower ?? 0,
    bin_upper: b.bin_upper ?? 0,
  }));

  const brierScore =
    testCal.brier_score != null && !isNaN(Number(testCal.brier_score))
      ? Number(testCal.brier_score).toFixed(4)
      : "unavailable";

  const ece =
    testCal.expected_calibration_error != null && !isNaN(Number(testCal.expected_calibration_error))
      ? Number(testCal.expected_calibration_error).toFixed(4)
      : "unavailable";

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
            Probability Calibration (Reliability Curve)
          </h3>
          <p className="text-[11px] text-mist-400 mt-0.5">
            Compares predicted output probabilities against observed empirical phishing frequency.
          </p>
        </div>

        {/* Brier Score & ECE Badges */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="border border-surface-border bg-surface-subtle px-2.5 py-1 rounded">
            <span className="text-mist-500 text-[10px] uppercase mr-1.5">Brier Score:</span>
            <span className="text-mist-100 font-semibold tabular">{brierScore}</span>
          </div>
          <div className="border border-surface-border bg-surface-subtle px-2.5 py-1 rounded">
            <span className="text-mist-500 text-[10px] uppercase mr-1.5">ECE:</span>
            <span className="text-mist-100 font-semibold tabular">{ece}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* SVG Reliability Plot (7 cols) */}
        <div className="lg:col-span-7 border border-surface-border bg-surface-canvas rounded p-3">
          <svg viewBox="0 0 320 220" className="w-full h-auto select-none">
            {/* Grid Lines */}
            <line x1="40" y1="20" x2="300" y2="20" stroke="#1E222A" strokeWidth="1" />
            <line x1="40" y1="65" x2="300" y2="65" stroke="#1E222A" strokeWidth="1" />
            <line x1="40" y1="110" x2="300" y2="110" stroke="#1E222A" strokeWidth="1" />
            <line x1="40" y1="155" x2="300" y2="155" stroke="#1E222A" strokeWidth="1" />
            <line x1="40" y1="200" x2="300" y2="200" stroke="#2A303C" strokeWidth="1" />

            <line x1="40" y1="20" x2="40" y2="200" stroke="#2A303C" strokeWidth="1" />
            <line x1="105" y1="20" x2="105" y2="200" stroke="#1E222A" strokeWidth="1" />
            <line x1="170" y1="20" x2="170" y2="200" stroke="#1E222A" strokeWidth="1" />
            <line x1="235" y1="20" x2="235" y2="200" stroke="#1E222A" strokeWidth="1" />
            <line x1="300" y1="20" x2="300" y2="200" stroke="#1E222A" strokeWidth="1" />

            {/* Perfect Calibration Diagonal (0,0) to (1,1) */}
            <line x1="40" y1="200" x2="300" y2="20" stroke="#363D4E" strokeWidth="1" strokeDasharray="3 3" />

            {/* Axis Y Labels */}
            <text x="32" y="24" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">1.0</text>
            <text x="32" y="114" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.5</text>
            <text x="32" y="204" textAnchor="end" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.0</text>

            {/* Axis X Labels */}
            <text x="40" y="214" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">0.0</text>
            <text x="170" y="214" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">Mean Predicted</text>
            <text x="300" y="214" textAnchor="middle" fill="#525866" fontSize="8" fontFamily="Geist Mono">1.0</text>

            {/* Reliability Bins Polyline */}
            {bins.length > 0 && (
              <polyline
                points={bins
                  .map((b) => {
                    const x = 40 + b.mean_predicted * 260;
                    const y = 200 - b.observed_fraction * 180;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#38C0E4"
                strokeWidth="1.75"
              />
            )}

            {/* Reliability Bin Dots */}
            {bins.map((b, i) => {
              const x = 40 + b.mean_predicted * 260;
              const y = 200 - b.observed_fraction * 180;

              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#38C0E4"
                  stroke="#090A0C"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
        </div>

        {/* Reliability Bin Table (5 cols) */}
        <div className="lg:col-span-5 border border-surface-border rounded overflow-hidden">
          <div className="bg-surface-subtle px-3 py-2 border-b border-surface-border text-[10px] font-mono text-mist-500 uppercase tracking-wider">
            Empirical Decile Calibration
          </div>
          <div className="max-h-56 overflow-y-auto">
            <table className="w-full text-left font-mono text-[10px]">
              <thead className="bg-surface-subtle/40 text-mist-500 border-b border-surface-border">
                <tr>
                  <th className="py-1.5 px-2.5">Bin</th>
                  <th className="py-1.5 px-2 text-right">Count</th>
                  <th className="py-1.5 px-2 text-right">Predicted</th>
                  <th className="py-1.5 px-2.5 text-right">Observed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50 text-mist-300">
                {bins.map((b, idx) => (
                  <tr key={idx} className="hover:bg-surface-subtle/30">
                    <td className="py-1 px-2.5 text-mist-400">#{idx + 1}</td>
                    <td className="py-1 px-2 text-right tabular text-mist-500">{b.count}</td>
                    <td className="py-1 px-2 text-right tabular text-mist-300">{(b.mean_predicted * 100).toFixed(1)}%</td>
                    <td className="py-1 px-2.5 text-right tabular text-brand font-medium">
                      {(b.observed_fraction * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
