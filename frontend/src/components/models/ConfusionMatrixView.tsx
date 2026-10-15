import { ConfusionMatrix } from "../../api/phish360";

export function ConfusionMatrixView({ cm }: { cm: ConfusionMatrix }) {
  const [negLabel, posLabel] = cm.labels;
  const [[tn, fp], [fn, tp]] = cm.matrix;
  const max = Math.max(tn, fp, fn, tp) || 1;

  const cell = (value: number, correct: boolean) => {
    const intensity = 0.12 + 0.55 * (value / max);
    return (
      <div
        className="flex min-w-0 flex-col items-center justify-center rounded-lg border px-3 py-4"
        style={{
          borderColor: correct ? `rgba(43,182,115,${0.25 + intensity * 0.4})` : `rgba(226,102,28,${0.25 + intensity * 0.4})`,
          backgroundColor: correct ? `rgba(43,182,115,${intensity * 0.25})` : `rgba(226,102,28,${intensity * 0.25})`,
        }}
      >
        <span className="tabular font-display text-xl font-semibold text-mist-100">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 text-[11px] text-mist-500">
        <div />
        <div className="truncate text-center">predicted {negLabel}</div>
        <div className="truncate text-center">predicted {posLabel}</div>
        <div className="flex items-center justify-end pr-1 text-right">actual {negLabel}</div>
        {cell(tn, true)}
        {cell(fp, false)}
        <div className="flex items-center justify-end pr-1 text-right">actual {posLabel}</div>
        {cell(fn, false)}
        {cell(tp, true)}
      </div>
    </div>
  );
}
