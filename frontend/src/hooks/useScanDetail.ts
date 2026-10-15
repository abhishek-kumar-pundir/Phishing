import { useEffect, useState } from "react";
import { fetchScanDetail, ScanDetailResponse } from "../api/phish360";

interface State {
  data: ScanDetailResponse | null;
  loading: boolean;
  error: string | null;
}

export function useScanDetail(scanId: string | number | null | undefined) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    if (scanId == null || scanId === "") {
      setState({ data: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState((prev) => ({ ...prev, loading: true, error: null }));
    fetchScanDetail(scanId)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err instanceof Error ? err.message : "Failed to load scan" });
      });
    return () => {
      cancelled = true;
    };
  }, [scanId]);

  return state;
}
