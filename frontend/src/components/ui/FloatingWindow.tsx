import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useDragControls } from "framer-motion";
import { prefersReducedMotion } from "../../lib/tone";

interface Props {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  width?: number;
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 640);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const handler = () => setMobile(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);
  return mobile;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null);
}

export function FloatingWindow({ open, onClose, title, subtitle, headerExtra, children, width = 448 }: Props) {
  const isMobile = useIsMobile();
  const reducedMotion = prefersReducedMotion();
  const dragControls = useDragControls();
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement;
    const t = setTimeout(() => panelRef.current?.focus(), 40);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = getFocusable(panelRef.current);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(9,10,12,0.75)" }}
          />

          {isMobile ? (
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={typeof title === "string" ? title : undefined}
              tabIndex={-1}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={reducedMotion ? { duration: 0.01 } : { type: "spring", damping: 32, stiffness: 320 }}
              className="absolute inset-x-0 bottom-0 flex max-h-[85vh] flex-col overflow-hidden rounded-t-lg border border-surface-border bg-surface-card outline-none"
            >
              <Header title={title} subtitle={subtitle} onClose={onClose} handleProps={{}} showGrip headerExtra={headerExtra} />
              <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-1">{children}</div>
            </motion.div>
          ) : (
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={typeof title === "string" ? title : undefined}
              tabIndex={-1}
              drag
              dragControls={dragControls}
              dragListener={false}
              dragMomentum={false}
              dragElastic={0}
              initial={{ opacity: 0, x: 28, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.97 }}
              transition={reducedMotion ? { duration: 0.01 } : { duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-[5vw] top-[7vh] flex max-h-[82vh] flex-col overflow-hidden rounded-lg border border-surface-border bg-surface-card outline-none"
              style={{ width, maxWidth: "90vw" }}
            >
              <Header
                title={title}
                subtitle={subtitle}
                onClose={onClose}
                headerExtra={headerExtra}
                handleProps={{ onPointerDown: (e: React.PointerEvent) => dragControls.start(e) }}
              />
              <div className="min-w-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-1">{children}</div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}

function Header({
  title,
  subtitle,
  onClose,
  handleProps,
  showGrip = false,
  headerExtra,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  onClose: () => void;
  handleProps: React.HTMLAttributes<HTMLDivElement>;
  showGrip?: boolean;
  headerExtra?: React.ReactNode;
}) {
  return (
    <div
      {...handleProps}
      className={`sticky top-0 z-10 border-b border-surface-border bg-surface-card px-5 pb-4 pt-4 ${
        !showGrip ? "cursor-grab active:cursor-grabbing" : ""
      }`}
    >
      {showGrip && <span className="absolute left-1/2 top-2 h-1 w-9 -translate-x-1/2 rounded-full bg-white/15" />}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-[0.08em] text-mist-400">{title}</p>
          {subtitle && <div className="mt-1">{subtitle}</div>}
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-mist-300 transition-colors hover:border-white/25 hover:bg-white/[0.06] hover:text-mist-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal-scan"
        >
          <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {headerExtra && <div className="mt-3">{headerExtra}</div>}
    </div>
  );
}
