import { useEffect, useState } from "react";
import { ErrorAnalysisResponse, fetchErrorAnalysis } from "../api/phish360";

interface State {
  data: ErrorAnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export function useErrorAnalysis(limit = 8) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchErrorAnalysis(limit)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: err instanceof Error ? err.message : "Failed to load" });
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
