import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/auth";
import DashboardLayout from "../layouts/DashboardLayout";
import "./styles/evaluation.css";

function EvaluationReport() {

  const { id } = useParams();

  const [report, setReport] = useState(null);

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {

    try {

      const res = await API.get(`/evaluation/${id}`);

      setReport(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  if (!report) {
    return (
      <DashboardLayout>
        <h2>Loading Report...</h2>
      </DashboardLayout>
    );
  }
  
  return (
  <DashboardLayout>
    <div className="report-container">

      <h1>Interview Evaluation Report</h1>

      <hr />

      <h2>Scores</h2>

      <div className="score-box">
        <div className="score-card">
          <h3>Technical</h3>
          <p>{report.technical_score}/10</p>
        </div>

        <div className="score-card">
          <h3>Communication</h3>
          <p>{report.communication_score}/10</p>
        </div>

        <div className="score-card">
          <h3>Confidence</h3>
          <p>{report.confidence_score}/10</p>
        </div>
      </div>

      <h2>Question-wise Analysis</h2>

     {report.question_analysis?.map((q, i) => (
  <div key={i} className="question-card">
    
    <p>
      <b>Question {q.questionNumber + 1}:</b> {q.question}
    </p>

    <p>Score: {q.score}/10</p>

    <p>{q.feedback}</p>

  </div>
))}

      <h2>Final Feedback</h2>
      <p>{report.final_feedback}</p>

    </div>
  </DashboardLayout>
);
}

export default EvaluationReport;