import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useHealth } from "../../hooks/useHealth";

function HealthPill() {
  const { loaded, modelsAvailable } = useHealth();
  const online = loaded && (modelsAvailable?.length ?? 0) > 0;
  return (
    <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] text-mist-400 sm:flex">
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-signal-safe animate-pulseGlow" : "bg-signal-idle"}`} />
      {!loaded ? "checking backend…" : online ? `${modelsAvailable?.length} models online` : "no models available"}
    </div>
  );
}

export function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen min-w-0 bg-ink-900">
      <Sidebar />
      <MobileNav />
      <div className="min-w-0 lg:pl-60">
        <div className="hidden items-center justify-end border-b border-white/[0.06] px-6 py-2.5 lg:flex">
          <HealthPill />
        </div>
        <main key={location.pathname} className="min-w-0 animate-fadeIn px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          <div className="mx-auto min-w-0 max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
