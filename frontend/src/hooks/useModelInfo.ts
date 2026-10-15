import { useEffect, useState } from "react";
import { fetchModelInfo, ModelInfoResponse } from "../api/phish360";

interface State {
  data: ModelInfoResponse | null;
  loading: boolean;
  error: string | null;
}

/** Fetches /model-info once on mount. This is the only place the "how
 * much does each modality actually matter" numbers come from -- they are
 * computed by the backend from artifacts/metrics/*.json and the fusion
 * model's fitted coefficients, not hardcoded here. */
export function useModelInfo() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchModelInfo()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({
            data: null,
            loading: false,
            error: err instanceof Error ? err.message : "Failed to load /model-info",
          });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
