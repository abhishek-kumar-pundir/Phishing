interface Props {
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "default" | "danger";
}

export function EmptyState({ title, description, action, tone = "default" }: Props) {
  return (
    <div
      className={`surface flex flex-col items-center gap-2 px-6 py-12 text-center ${
        tone === "danger" ? "border-signal-danger/30 bg-signal-danger/[0.04]" : ""
      }`}
    >
      <p className="font-display text-base font-medium text-mist-100">{title}</p>
      {description && <p className="max-w-md text-sm text-mist-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
