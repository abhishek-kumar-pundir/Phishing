import { useEffect, useState } from "react";
import { fetchThresholdAnalysis, ThresholdAnalysisResponse } from "../api/phish360";

interface State {
  data: ThresholdAnalysisResponse | null;
  loading: boolean;
  error: string | null;
}

export function useThresholdAnalysis() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchThresholdAnalysis()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load /threshold-analysis",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
