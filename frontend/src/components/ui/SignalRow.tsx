import { Signal, SignalTone } from "../../lib/evidence";

const ICON: Record<SignalTone, React.ReactNode> = {
  good: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-signal-safeSoft" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" opacity="0.35" />
      <path d="M5 8.3l2 2 4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-signal-warn" fill="none">
      <path d="M8 2.3l6.2 10.8a1 1 0 0 1-.87 1.5H2.67a1 1 0 0 1-.87-1.5L8 2.3z" stroke="currentColor" strokeWidth="1.3" opacity="0.4" />
      <path d="M8 6.5v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="0.8" fill="currentColor" />
    </svg>
  ),
  risk: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-signal-dangerSoft" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" opacity="0.35" />
      <path d="M5.8 5.8l4.4 4.4M10.2 5.8l-4.4 4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  neutral: (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 text-mist-500" fill="none">
      <circle cx="8" cy="8" r="2" fill="currentColor" />
    </svg>
  ),
};

export function SignalRow({ signal }: { signal: Signal }) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <span className="mt-0.5">{ICON[signal.tone]}</span>
      <span className="text-sm leading-snug text-mist-200">{signal.text}</span>
    </div>
  );
}

export function SignalRows({ signals }: { signals: Signal[] }) {
  return (
    <div className="min-w-0">
      {signals.map((s, i) => (
        <SignalRow key={i} signal={s} />
      ))}
    </div>
  );
}
