import { Suspense, lazy } from "react";
import { UnifiedScanResult } from "../../../lib/scanResult";

const FusionScene3DImpl = lazy(() =>
  import("./FusionScene3D").then((m) => ({ default: m.FusionScene3D }))
);

function ScenePlaceholder() {
  return (
    <div className="flex h-[320px] w-full min-w-0 items-center justify-center sm:h-[380px] lg:h-[440px]">
      <div className="h-16 w-16 animate-pulseGlow rounded-full border border-signal-scan/30 bg-signal-scan/10" />
    </div>
  );
}

export function FusionScene3DLazy(props: { result: UnifiedScanResult; running: boolean }) {
  return (
    <Suspense fallback={<ScenePlaceholder />}>
      <FusionScene3DImpl {...props} />
    </Suspense>
  );
}
