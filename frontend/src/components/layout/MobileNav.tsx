import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, RESEARCH_SUBNAV } from "../../lib/nav";
import { LogoMark } from "../ui/Glyphs";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="sticky top-0 z-40 border-b border-surface-border bg-surface-canvas/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/scan" className="flex items-center gap-2">
          <LogoMark size={18} className="text-brand" />
          <span className="font-mono text-xs font-semibold tracking-wider text-mist-100">PHISH360</span>
        </Link>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation menu"
          className="px-2.5 py-1 text-xs font-mono border border-surface-border rounded bg-surface-subtle text-mist-300"
        >
          {open ? "CLOSE" : "MENU"}
        </button>
      </div>

      {open && (
        <div className="border-t border-surface-border bg-surface-canvas px-4 py-4 space-y-4">
          <div className="space-y-1">
            <p className="font-mono text-[10px] text-mist-500 uppercase tracking-wider mb-1">Navigation</p>
            {PRIMARY_NAV.map((item) => (
              <Link
                key={item.key}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-xs rounded ${
                  pathname.startsWith(item.to)
                    ? "bg-brand-soft text-brand font-medium"
                    : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[10px] text-mist-500 uppercase tracking-wider mb-1">Research Subsections</p>
            {RESEARCH_SUBNAV.map((sub) => (
              <Link
                key={sub.key}
                to={sub.to}
                onClick={() => setOpen(false)}
                className={`block px-3 py-2 text-xs rounded ${
                  pathname === sub.to
                    ? "bg-brand-soft text-brand font-medium"
                    : "text-mist-400 hover:text-mist-200"
                }`}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
