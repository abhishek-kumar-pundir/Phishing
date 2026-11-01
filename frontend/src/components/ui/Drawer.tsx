import { useEffect } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function Drawer({ open, onClose, title, subtitle, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-sans">
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-md min-w-0 flex-col border-l border-surface-border bg-surface-card sm:max-w-lg">
        <div className="flex items-start justify-between gap-3 border-b border-surface-border px-5 py-4 bg-surface-subtle">
          <div className="min-w-0">
            <h2 className="truncate font-mono text-sm font-semibold text-mist-100">{title}</h2>
            {subtitle && <p className="mt-0.5 truncate text-[11px] font-mono text-mist-500 uppercase">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="shrink-0 rounded border border-surface-border p-1.5 text-mist-400 hover:text-mist-100 hover:bg-surface-canvas font-mono text-xs"
          >
            ✕
          </button>
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
