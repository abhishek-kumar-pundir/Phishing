import { Suspense, lazy } from "react";
import { Modality } from "../../../api/phish360";
import { UnifiedScanResult } from "../../../lib/scanResult";

const FusionScene3DImpl = lazy(() =>
  import("./FusionScene3D").then((m) => ({ default: m.FusionScene3D }))
);

function ScenePlaceholder() {
  return (
    <div className="flex h-[380px] sm:h-[420px] lg:h-[460px] w-full min-w-0 items-center justify-center border border-surface-border bg-surface-canvas rounded-lg">
      <div className="flex items-center gap-2 font-mono text-xs text-mist-500">
        <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
        <span>INITIALIZING PIPELINE TOPOLOGY…</span>
      </div>
    </div>
  );
}

export function FusionScene3DLazy(props: {
  result: UnifiedScanResult;
  running: boolean;
  selectedModality?: Modality;
  onSelectModality?: (m: Modality) => void;
}) {
  return (
    <Suspense fallback={<ScenePlaceholder />}>
      <FusionScene3DImpl {...props} />
    </Suspense>
  );
}
