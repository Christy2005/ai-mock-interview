import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import InterviewSetup from "./pages/InterviewSetup.jsx";
import InterviewRoom from "./pages/InterviewRoom.jsx";
import EvaluationReport from "./pages/EvaluationReport.jsx";
import PracticePage from "./pages/PracticePage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

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