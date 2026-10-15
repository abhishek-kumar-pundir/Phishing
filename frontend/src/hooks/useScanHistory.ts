import { useCallback, useEffect, useState } from "react";
import { fetchScanStats, fetchScans, ScanRecord, ScanStatsResponse } from "../api/phish360";

interface State {
  scans: ScanRecord[];
  stats: ScanStatsResponse | null;
  loading: boolean;
  error: string | null;
}

export function useScanHistory() {
  const [state, setState] = useState<State>({ scans: [], stats: null, loading: true, error: null });

  const refresh = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    Promise.all([fetchScans(100), fetchScanStats()])
      .then(([{ scans }, stats]) => {
        setState({ scans, stats, loading: false, error: null });
      })
      .catch((err) => {
        setState({
          scans: [],
          stats: null,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to load scan history",
        });
      });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { ...state, refresh };
}
