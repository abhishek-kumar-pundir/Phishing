import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { PRIMARY_NAV, RESEARCH_SUBNAV, getActiveNavKey } from "../../lib/nav";
import { LogoMark } from "../ui/Glyphs";
import { useHealth } from "../../hooks/useHealth";

function HealthIndicator() {
  const { loaded, modelsAvailable } = useHealth();
  const online = loaded && (modelsAvailable?.length ?? 0) > 0;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded border border-surface-border bg-surface-subtle text-[11px] font-mono tabular text-mist-400">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          !loaded
            ? "bg-mist-600"
            : online
            ? "bg-verdict-legit"
            : "bg-verdict-phish"
        }`}
      />
      <span>
        {!loaded
          ? "CONNECTING"
          : online
          ? `${modelsAvailable?.length ?? 0} MODELS ONLINE`
          : "OFFLINE"}
      </span>
    </div>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const activeKey = getActiveNavKey(pathname);
  const isResearchSection = pathname.startsWith("/research");

  return (
    <div className="min-h-screen bg-surface-canvas text-mist-100 flex flex-col font-sans selection:bg-brand/20 selection:text-brand">
      {/* Top Application Header */}
      <header className="sticky top-0 z-40 w-full bg-surface-canvas/95 border-b border-surface-border">
        <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-6">
            <Link to="/scan" className="flex items-center gap-2.5 group">
              <LogoMark className="text-brand transition-transform group-hover:scale-105" />
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-xs font-semibold tracking-wider text-mist-100">
                  PHISH360
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-mist-500 uppercase">
                  v2.0
                </span>
              </div>
            </Link>

            <div className="h-4 w-[1px] bg-surface-border hidden sm:block" />

            {/* Primary Text-Only Navigation */}
            <nav className="flex items-center gap-1 sm:gap-2">
              {PRIMARY_NAV.map((item) => {
                const isActive =
                  (item.key === "scan" && pathname.startsWith("/scan")) ||
                  (item.key === "models" && pathname.startsWith("/models")) ||
                  (item.key === "history" && pathname.startsWith("/history")) ||
                  (item.key === "research" && pathname.startsWith("/research"));

                return (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={`relative px-3 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "text-brand"
                        : "text-mist-400 hover:text-mist-200"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-[-13px] left-3 right-3 h-[1.5px] bg-brand" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Header Status */}
          <div className="flex items-center gap-4">
            <HealthIndicator />
          </div>
        </div>

        {/* Research Sub-Navigation Strip (Visible only within /research/*) */}
        {isResearchSection && (
          <div className="w-full bg-surface-subtle/80 border-t border-surface-border">
            <div className="max-w-[1440px] mx-auto px-6 h-9 flex items-center gap-6 overflow-x-auto text-[11px] font-mono">
              {RESEARCH_SUBNAV.map((sub) => {
                const isSubActive =
                  (sub.key === "research_overview" && pathname === "/research") ||
                  (sub.key === "research_ablation" && pathname.startsWith("/research/ablation")) ||
                  (sub.key === "research_errors" && pathname.startsWith("/research/errors")) ||
                  (sub.key === "research_explainability" && pathname.startsWith("/research/explainability"));

                return (
                  <Link
                    key={sub.key}
                    to={sub.to}
                    className={`transition-colors whitespace-nowrap ${
                      isSubActive
                        ? "text-brand border-b border-brand pb-1 font-semibold"
                        : "text-mist-500 hover:text-mist-300 pb-1"
                    }`}
                  >
                    {sub.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6 min-w-0">
        <Outlet />
      </main>

      {/* Footer Info */}
      <footer className="border-t border-surface-border bg-surface-subtle/40 py-4 text-[11px] font-mono text-mist-500">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PHISH360 MULTIMODAL FORENSICS — CALIBRATED INFERENCE ENGINE</span>
          <span className="tabular text-mist-600">URL · DOM · TEXT · VISION · LOGREG FUSION</span>
        </div>
      </footer>
    </div>
  );
}
