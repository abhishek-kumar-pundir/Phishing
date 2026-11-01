import { ConfusionMatrix } from "../../api/phish360";

export function ConfusionMatrixView({ cm }: { cm: ConfusionMatrix }) {
  const [negLabel, posLabel] = cm.labels;
  const [[tn, fp], [fn, tp]] = cm.matrix;

  const cell = (value: number, correct: boolean) => {
    return (
      <div
        className={`flex min-w-0 flex-col items-center justify-center rounded border px-3 py-3 font-mono ${
          correct
            ? "border-verdict-legit/30 bg-verdict-legit/10 text-mist-100"
            : value > 0
            ? "border-verdict-phish/30 bg-verdict-phish/10 text-verdict-phish"
            : "border-surface-border bg-surface-subtle text-mist-500"
        }`}
      >
        <span className="tabular text-lg font-semibold">{value}</span>
      </div>
    );
  };

  return (
    <div className="min-w-0 font-mono text-[10px]">
      <div className="grid grid-cols-[auto_1fr_1fr] gap-1.5 text-mist-500">
        <div />
        <div className="truncate text-center uppercase tracking-wider py-1">pred {negLabel}</div>
        <div className="truncate text-center uppercase tracking-wider py-1">pred {posLabel}</div>
        <div className="flex items-center justify-end pr-2 text-right uppercase tracking-wider">
          act {negLabel}
        </div>
        {cell(tn, true)}
        {cell(fp, false)}
        <div className="flex items-center justify-end pr-2 text-right uppercase tracking-wider">
          act {posLabel}
        </div>
        {cell(fn, false)}
        {cell(tp, true)}
      </div>
    </div>
  );
}
