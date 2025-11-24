import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PollPage from "./pages/PollPage";
import CreatePollPage from "./pages/CreatePollPage";

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/poll/:id" element={<PollPage />} />
        <Route path="/create" element={<CreatePollPage />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
