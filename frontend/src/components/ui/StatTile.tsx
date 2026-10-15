interface Props {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "default" | "safe" | "danger" | "scan";
}

const VALUE_TONE: Record<string, string> = {
  default: "text-mist-100",
  safe: "text-signal-safeSoft",
  danger: "text-signal-dangerSoft",
  scan: "text-signal-scanSoft",
};

export function StatTile({ label, value, sublabel, tone = "default" }: Props) {
  return (
    <div className="surface-tight min-w-0 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-mist-500">{label}</p>
      <p className={`tabular mt-1 truncate font-display text-xl font-semibold ${VALUE_TONE[tone]}`}>{value}</p>
      {sublabel && <p className="mt-0.5 truncate text-[11px] text-mist-500">{sublabel}</p>}
    </div>
  );
}
