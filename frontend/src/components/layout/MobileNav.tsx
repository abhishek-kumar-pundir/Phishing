import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, RESEARCH_NAV, getActiveNavKey } from "../../lib/nav";
import { NavIcon } from "./NavIcon";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const activeKey = getActiveNavKey(pathname);

  return (
    <div className="sticky top-0 z-40 border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-signal-scan to-signal-scan/40">
            <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 text-white" fill="none">
              <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
              <circle cx="10" cy="10" r="1.8" fill="currentColor" />
            </svg>
          </div>
          <span className="font-display text-sm font-semibold text-mist-100">PHISH360</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-mist-300"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
            {open ? (
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="animate-fadeIn space-y-5 border-t border-white/[0.07] px-4 pb-5 pt-4">
          <div className="space-y-1">
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                  activeKey === item.key ? "bg-signal-scan/12 text-mist-100" : "text-mist-400"
                }`}
              >
                <NavIcon name={item.icon} />
                {item.label}
              </Link>
            ))}
          </div>
          <div>
            <p className="px-3 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-mist-600">
              Research &amp; evaluation
            </p>
            <div className="space-y-1">
              {RESEARCH_NAV.map((item) => (
                <Link
                  key={item.key}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${
                    activeKey === item.key ? "bg-signal-scan/12 text-mist-100" : "text-mist-400"
                  }`}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
