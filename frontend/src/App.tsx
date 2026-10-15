import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { ScanProvider } from "./context/ScanContext";

import ScanInputPage from "./routes/ScanInputPage";
import ScanPage from "./routes/ScanPage";
import HistoryPage from "./routes/HistoryPage";
import HistoryDetailPage from "./routes/HistoryDetailPage";
import ModelsPage from "./routes/ModelsPage";
import ModelDetailPage from "./routes/ModelDetailPage";
import ResearchOverviewPage from "./routes/ResearchOverviewPage";
import ResearchAblationPage from "./routes/ResearchAblationPage";
import ResearchErrorsPage from "./routes/ResearchErrorsPage";
import ResearchExplainabilityPage from "./routes/ResearchExplainabilityPage";
import NotFoundPage from "./routes/NotFoundPage";

export default function App() {
  return (
    <ScanProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Navigate to="/scan" replace />} />

          <Route path="/scan" element={<ScanInputPage />} />
          <Route path="/scan/:scanId" element={<ScanPage />} />

          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:scanId" element={<HistoryDetailPage />} />

          <Route path="/models" element={<ModelsPage />} />
          <Route path="/models/:model" element={<ModelDetailPage />} />

          <Route path="/research" element={<ResearchOverviewPage />} />
          <Route path="/research/ablation" element={<ResearchAblationPage />} />
          <Route path="/research/errors" element={<ResearchErrorsPage />} />
          <Route path="/research/explainability" element={<ResearchExplainabilityPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ScanProvider>
  );
}
