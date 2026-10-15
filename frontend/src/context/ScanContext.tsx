import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { PredictRequestInput } from "../api/phish360";
import { usePipelineScan } from "../hooks/usePipelineScan";

interface ScanContextValue {
  pipeline: ReturnType<typeof usePipelineScan>;
  liveId: string | null;
  screenshotObjectUrl: string | null;
  clientHtml: string | null;
  startScan: (input: PredictRequestInput) => string;
  resetScan: () => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const pipeline = usePipelineScan();
  const [liveId, setLiveId] = useState<string | null>(null);
  const [screenshotObjectUrl, setScreenshotObjectUrl] = useState<string | null>(null);
  const [clientHtml, setClientHtml] = useState<string | null>(null);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);
    };
  }, []);

  const startScan = useCallback(
    (input: PredictRequestInput) => {
      if (prevUrlRef.current) {
        URL.revokeObjectURL(prevUrlRef.current);
        prevUrlRef.current = null;
      }
      const objectUrl = input.screenshot ? URL.createObjectURL(input.screenshot) : null;
      prevUrlRef.current = objectUrl;
      setScreenshotObjectUrl(objectUrl);
      setClientHtml(input.allowFetch ? null : input.html ?? null);

      const id = `live-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      setLiveId(id);
      pipeline.start(input);
      return id;
    },
    [pipeline]
  );

  const resetScan = useCallback(() => {
    if (prevUrlRef.current) {
      URL.revokeObjectURL(prevUrlRef.current);
      prevUrlRef.current = null;
    }
    setScreenshotObjectUrl(null);
    setClientHtml(null);
    setLiveId(null);
    pipeline.reset();
  }, [pipeline]);

  const value = useMemo(
    () => ({ pipeline, liveId, screenshotObjectUrl, clientHtml, startScan, resetScan }),
    [pipeline, liveId, screenshotObjectUrl, clientHtml, startScan, resetScan]
  );

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScanContext(): ScanContextValue {
  const ctx = useContext(ScanContext);
  if (!ctx) throw new Error("useScanContext must be used within a ScanProvider");
  return ctx;
}
