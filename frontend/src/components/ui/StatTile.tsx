interface Props {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "safe" | "danger" | "scan";
}

const VALUE_TONE: Record<string, string> = {
  default: "text-mist-100",
  safe: "text-verdict-legit",
  danger: "text-verdict-phish",
  scan: "text-brand",
};

export function StatTile({ label, value, sublabel, tone = "default" }: Props) {
  return (
    <div className="border border-surface-border bg-surface-card rounded p-3 min-w-0 font-mono">
      <p className="text-[10px] uppercase tracking-wider text-mist-500">{label}</p>
      <p className={`tabular mt-0.5 truncate text-lg font-semibold ${VALUE_TONE[tone]}`}>{value}</p>
      {sublabel && <p className="mt-0.5 truncate text-[10px] text-mist-500">{sublabel}</p>}
    </div>
  );
}
