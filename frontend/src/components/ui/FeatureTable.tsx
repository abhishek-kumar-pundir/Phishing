export function FeatureTable({ features, limit }: { features: Record<string, number>; limit?: number }) {
  const entries = Object.entries(features).slice(0, limit);
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.06]">
      {entries.map(([k, v], i) => (
        <div
          key={k}
          className={`flex min-w-0 items-baseline justify-between gap-4 px-3.5 py-[11px] ${
            i > 0 ? "border-t border-white/[0.05]" : ""
          }`}
        >
          <span className="min-w-0 flex-1 break-words text-[13px] capitalize leading-snug text-mist-300">
            {k.replace(/_/g, " ")}
          </span>
          <span className="tabular shrink-0 text-[13px] font-medium text-mist-100">
            {typeof v === "number" ? (Number.isInteger(v) ? v : v.toFixed(3)) : String(v)}
          </span>
        </div>
      ))}
    </div>
  );
}
