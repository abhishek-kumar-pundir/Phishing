import { useNavigate } from "react-router-dom";
import { UrlForm } from "../components/scan/UrlForm";
import { useScanContext } from "../context/ScanContext";
import { PredictRequestInput } from "../api/phish360";

export default function ScanInputPage() {
  const { startScan, pipeline } = useScanContext();
  const navigate = useNavigate();

  const handleSubmit = (input: PredictRequestInput) => {
    const id = startScan(input);
    navigate(`/scan/${id}`);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <UrlForm onSubmit={handleSubmit} busy={pipeline.phase === "running"} />
    </div>
  );
}
