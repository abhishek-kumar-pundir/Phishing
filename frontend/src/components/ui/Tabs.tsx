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
      className={`flex min-w-0 flex-wrap gap-1 rounded-full border border-white/[0.08] bg-white/[0.02] p-1 ${className}`}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={active === t.key}
          onClick={() => onChange(t.key)}
          className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
            active === t.key ? "bg-signal-scan/15 text-mist-100" : "text-mist-400 hover:text-mist-200"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
