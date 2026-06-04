import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/register.jsx";
import Dashboard from "./pages/dashboard.jsx";
import InterviewSetup from "./pages/interviewsetup.jsx";
import InterviewRoom from "./pages/interviewroom.jsx";
import EvaluationReport from "./pages/evaluationreport.jsx";
import PracticePage from "./pages/practicepage.jsx";
import HistoryPage from "./pages/historypage.jsx";

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