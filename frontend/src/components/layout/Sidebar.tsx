import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PRIMARY_NAV, RESEARCH_SUBNAV } from "../../lib/nav";
import { LogoMark } from "../ui/Glyphs";
import { useHealth } from "../../hooks/useHealth";

function HealthIndicator() {
  const { loaded, modelsAvailable } = useHealth();
  const online = loaded && (modelsAvailable?.length ?? 0) > 0;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded border border-surface-border bg-surface-card text-[11px] font-mono tabular text-mist-400">
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          !loaded
            ? "bg-mist-600"
            : online
            ? "bg-verdict-legit"
            : "bg-verdict-phish"
        }`}
      />
      <span className="tracking-wide">
        {!loaded
          ? "CONNECTING"
          : online
          ? `${modelsAvailable?.length ?? 0} MODELS ONLINE`
          : "OFFLINE"}
      </span>
    </div>
  );
}

export function Sidebar() {
  const { pathname } = useLocation();
  const isResearch = pathname.startsWith("/research");

  return (
    <aside className="w-64 shrink-0 border-r border-surface-border bg-surface-subtle hidden lg:flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Top Branding & Primary Nav */}
      <div className="p-5 flex flex-col gap-6">
        {/* Brand Header */}
        <Link to="/scan" className="flex items-center gap-2.5 group">
          <LogoMark className="text-brand transition-transform group-hover:scale-105" />
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-sm font-semibold tracking-wider text-mist-100">
              PHISH360
            </span>
            <span className="font-mono text-[10px] text-mist-500 uppercase">
              v2.0
            </span>
          </div>
        </Link>

        {/* Primary Navigation */}
        <div className="space-y-1">
          <p className="font-mono text-[10px] text-mist-500 uppercase tracking-wider mb-2 px-3">
            Forensics Console
          </p>
          <nav className="flex flex-col gap-1">
            {PRIMARY_NAV.map((item) => {
              const active =
                (item.key === "scan" && pathname.startsWith("/scan")) ||
                (item.key === "models" && pathname.startsWith("/models")) ||
                (item.key === "history" && pathname.startsWith("/history")) ||
                (item.key === "research" && isResearch);

              return (
                <div key={item.key}>
                  <Link
                    to={item.to}
                    className={`flex items-center justify-between px-3 py-2 rounded text-xs transition-colors ${
                      active
                        ? "bg-surface-card text-brand font-medium border border-surface-border"
                        : "text-mist-400 hover:text-mist-200 hover:bg-surface-card/60"
                    }`}
                  >
                    <span>{item.label}</span>
                    {active && <span className="w-1 h-3 rounded-full bg-brand" />}
                  </Link>

                  {/* Nested Research Nav if on /research */}
                  {item.key === "research" && isResearch && (
                    <div className="ml-3 pl-3 my-1 border-l border-surface-border flex flex-col gap-0.5">
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
                            className={`px-2.5 py-1.5 rounded text-[11px] font-mono transition-colors ${
                              isSubActive
                                ? "text-brand font-medium bg-surface-canvas"
                                : "text-mist-500 hover:text-mist-300"
                            }`}
                          >
                            {sub.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Metadata & System Health */}
      <div className="p-5 border-t border-surface-border space-y-3 bg-surface-subtle/50">
        <HealthIndicator />
        <div className="text-[10px] font-mono text-mist-500 flex flex-col gap-0.5">
          <span>CALIBRATED LOGREG ENGINE</span>
          <span className="text-mist-600">URL · DOM · TEXT · VISION</span>
        </div>
      </div>
    </aside>
  );
}
