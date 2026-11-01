interface Tab {
  key: string;
  label: string;
}

interface Props {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className = "" }: Props) {
  return (
    <div
      role="tablist"
      className={`flex min-w-0 flex-wrap gap-1 rounded border border-surface-border bg-surface-subtle p-1 font-mono text-xs ${className}`}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`whitespace-nowrap rounded px-3 py-1 transition-colors ${
            active === t.key
              ? "bg-surface-card border border-surface-border text-brand font-semibold"
              : "text-mist-400 hover:text-mist-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
