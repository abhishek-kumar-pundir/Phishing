import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, RESEARCH_SUBNAV } from "../../lib/nav";

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-56 border-r border-surface-border bg-surface-subtle p-4 hidden lg:flex flex-col gap-6 text-xs">
      <div>
        <p className="font-mono text-[10px] text-mist-500 uppercase tracking-wider mb-2">Navigation</p>
        <nav className="flex flex-col gap-1">
          {PRIMARY_NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.key}
                to={item.to}
                className={`px-3 py-1.5 rounded transition-colors ${
                  active
                    ? "bg-brand-soft text-brand font-medium"
                    : "text-mist-400 hover:text-mist-200 hover:bg-surface-card"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <p className="font-mono text-[10px] text-mist-500 uppercase tracking-wider mb-2">Research</p>
        <nav className="flex flex-col gap-1">
          {RESEARCH_SUBNAV.map((sub) => {
            const active = pathname === sub.to;
            return (
              <Link
                key={sub.key}
                to={sub.to}
                className={`px-3 py-1.5 rounded transition-colors ${
                  active
                    ? "bg-brand-soft text-brand font-medium"
                    : "text-mist-400 hover:text-mist-200 hover:bg-surface-card"
                }`}
              >
                {sub.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
