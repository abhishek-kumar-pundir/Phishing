import { useState } from "react";
import { GlobalFeatureImportance, GlobalFeatureItem } from "../../api/phish360";

interface Props {
  importance: GlobalFeatureImportance | null;
}

export function GlobalFeatureImportanceCard({ importance }: Props) {
  const [activeTab, setActiveTab] = useState<"url" | "html">("url");

  if (!importance) {
    return (
      <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-mono text-xs text-mist-500">
        Global feature importance metrics unavailable.
      </div>
    );
  }

  const list: GlobalFeatureItem[] =
    activeTab === "url" ? importance.url || [] : importance.html || [];

  const maxVal = Math.max(0.01, ...list.map((item) => item.importance));

  return (
    <div className="border border-surface-border bg-surface-card rounded-lg p-5 font-sans space-y-4">
      {/* Header & Modality Toggle */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-surface-border pb-3">
        <div>
          <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-mist-100">
            Global Feature Importance (Gini Impurity)
          </h3>
          <p className="text-[11px] text-mist-400 mt-0.5">
            Macro feature weights across 300 Random Forest estimators. Explains model mechanics, not ground truth.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("url")}
            className={`px-3 py-1 rounded border transition-colors ${
              activeTab === "url"
                ? "border-brand text-brand bg-brand/10 font-semibold"
                : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
            }`}
          >
            URL Model ({importance.url?.length || 0})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("html")}
            className={`px-3 py-1 rounded border transition-colors ${
              activeTab === "html"
                ? "border-brand text-brand bg-brand/10 font-semibold"
                : "border-surface-border text-mist-400 hover:text-mist-200 bg-surface-subtle"
            }`}
          >
            DOM Model ({importance.html?.length || 0})
          </button>
        </div>
      </div>

      {/* Feature Importance Bars */}
      <div className="space-y-2.5 pt-1">
        {list.slice(0, 10).map((item, idx) => {
          const widthPct = ((item.importance / maxVal) * 100).toFixed(1);

          return (
            <div key={item.feature} className="space-y-1 font-mono text-xs">
              <div className="flex justify-between items-baseline text-[11px]">
                <span className="text-mist-200 truncate mr-3">
                  <span className="text-mist-500 mr-2">#{idx + 1}</span>
                  {item.feature}
                </span>
                <span className="text-mist-400 tabular shrink-0">
                  {(item.importance * 100).toFixed(2)}%
                </span>
              </div>

              <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand/70 rounded-full transition-all duration-300"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Honesty Notice */}
      <div className="border-t border-surface-border pt-3 text-[10px] font-mono text-mist-500 flex items-center justify-between">
        <span>Method: {importance.method}</span>
        <span className="text-mist-600">Sum of mean impurity decrease</span>
      </div>
    </div>
  );
}

