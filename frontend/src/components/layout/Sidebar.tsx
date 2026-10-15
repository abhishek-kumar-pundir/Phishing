import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, RESEARCH_NAV, getActiveNavKey } from "../../lib/nav";
import { NavIcon } from "./NavIcon";

function NavLink({ item, active }: { item: (typeof PRIMARY_NAV)[number]; active: boolean }) {
  return (
    <Link
      to={item.to}
      className={`group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-signal-scan/12 text-mist-100"
          : "text-mist-400 hover:bg-white/[0.04] hover:text-mist-100"
      }`}
    >
      <span className={active ? "text-signal-scanSoft" : "text-mist-500 group-hover:text-mist-300"}>
        <NavIcon name={item.icon} />
      </span>
      {item.label}
      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-signal-scan" />}
    </Link>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();
  const activeKey = getActiveNavKey(pathname);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-white/[0.07] bg-ink-950/70 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-signal-scan to-signal-scan/40 shadow-glow">
          <svg viewBox="0 0 20 20" className="h-4 w-4 text-white" fill="none">
            <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="10" cy="10" r="1.8" fill="currentColor" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold leading-tight text-mist-100">PHISH360</p>
          <p className="truncate text-[10px] uppercase tracking-wider text-mist-500">Investigation console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-6">
        <div className="space-y-1">
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.key} item={item} active={activeKey === item.key} />
          ))}
        </div>

        <div>
          <p className="px-3 pb-1.5 text-[10px] font-medium uppercase tracking-wider text-mist-600">
            Research &amp; evaluation
          </p>
          <div className="space-y-1">
            {RESEARCH_NAV.map((item) => (
              <NavLink key={item.key} item={item} active={activeKey === item.key} />
            ))}
          </div>
        </div>
      </nav>

      <div className="border-t border-white/[0.06] px-5 py-4">
        <p className="text-[11px] leading-relaxed text-mist-600">
          Multimodal phishing detection across URL, HTML/DOM, text and vision signals.
        </p>
      </div>
    </aside>
  );
}
