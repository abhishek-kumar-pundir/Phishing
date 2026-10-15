import { useEffect, useState } from "react";
import { fetchHealth } from "../api/phish360";

export function useHealth() {
  const [modelsAvailable, setModelsAvailable] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchHealth()
      .then((h) => {
        if (!cancelled) setModelsAvailable(h.models_available);
      })
      .catch(() => {
        if (!cancelled) setModelsAvailable([]); // fail closed: treat as nothing confirmed available
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {
    visionAvailable: modelsAvailable?.includes("vision_model") ?? true, // true (unknown) until we hear otherwise, so we don't flash-hide the control
    loaded: modelsAvailable !== null,
    modelsAvailable,
  };
}
