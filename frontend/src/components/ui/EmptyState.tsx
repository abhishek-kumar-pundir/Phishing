import React from "react";

interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "default" | "danger";
}

export function EmptyState({ title, description, action, tone = "default" }: Props) {
  return (
    <div
      className={`border rounded-lg flex flex-col items-center gap-2 px-6 py-12 text-center font-sans ${
        tone === "danger"
          ? "border-verdict-phish/40 bg-surface-card"
          : "border-surface-border bg-surface-card"
      }`}
    >
      <p className="font-mono text-sm font-semibold text-mist-100">{title}</p>
      {description && <p className="max-w-md text-xs text-mist-400 font-sans">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
