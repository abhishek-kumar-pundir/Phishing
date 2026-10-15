import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";

export default function NotFoundPage() {
  return (
    <EmptyState
      title="Page not found"
      description="That route doesn't exist in Phish360."
      action={
        <Link to="/scan" className="rounded-lg bg-signal-scan px-4 py-2 text-sm font-semibold text-white">
          Go to Scan
        </Link>
      }
    />
  );
}
