import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/auth";
import DashboardLayout from "../layouts/DashboardLayout";
import "./styles/interviewsetup.css";

function InterviewSetup() {

  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [duration, setDuration] = useState(15);
  const [loading,setLoading]=useState(false);
  const startInterview = async () => {
    setLoading(true);
  try {
   // await enterFullscreen();
   
    const token = localStorage.getItem("token");

    const res = await API.post(
      "/ai/generate-questions",
      {
        role,
        domain,
        difficulty,
        duration
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const generatedQuestions = res.data.questions;

    // Create interview session + attach questions (you can extend DB later)
    const interviewRes = await API.post(
      "/interview/create-with-questions",
      {
        role,
        domain,
        difficulty,
        duration,
        questions: generatedQuestions
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    localStorage.setItem("latestInterviewId", interviewRes.data.id);
    navigate(`/interview/${interviewRes.data.id}`);

  } catch (err) {
    console.log(err);
  }finally{
    setLoading(false);
  }
};

  return (
    
    <DashboardLayout>
      <div className="setup-container">

      <h1>Interview Setup</h1>

      <input
        placeholder="Role"
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        placeholder="Domain"
        onChange={(e) => setDomain(e.target.value)}
      />

      <select onChange={(e) => setDifficulty(e.target.value)}>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <select onChange={(e) => setDuration(e.target.value)}>
        <option value={15}>15 mins</option>
        <option value={30}>30 mins</option>
        <option value={45}>45 mins</option>
      </select>

      <button onClick={startInterview} disabled={loading}>
       {loading? "starting interview...":"Start Interview"} 
      </button>
    </div>
    </DashboardLayout>
    
  );
}

export default InterviewSetup;