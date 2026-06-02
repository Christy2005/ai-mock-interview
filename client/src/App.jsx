import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewRoom from "./pages/InterviewRoom";
import EvaluationReport from "./pages/EvaluationReport";
import PracticePage from "./pages/PracticePage";
import HistoryPage from "./pages/HistoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<InterviewSetup />} />
        <Route path="/interview/:id" element={<InterviewRoom />} />
        <Route path="/evaluation/:id" element={<EvaluationReport />}/>
        <Route path="/practice" element={<PracticePage />}/>
        <Route path="/history" element={<HistoryPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;