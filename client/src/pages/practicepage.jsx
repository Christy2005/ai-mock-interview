import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import API from "../api/auth";
import "./styles/practice.css";
import jsPDF from "jspdf";

function PracticePage() {

  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [answers,setAnswers]=useState({});
  const [loadingAnswer, setLoadingAnswer]=useState({});

  const generatePractice = async () => {

    setLoading(true);

    try {

      const res = await API.post(
        "/ai/generate-questions",
        {
          role,
          domain,
          difficulty,
          duration: 45
        }
      );

      setQuestions(res.data.questions);

    } catch (err) {

      console.log(err);

    } finally {

      setLoading(false);
    }
  };
  const fetchAnswer = async (question, index) => {

  // already loaded
  if (answers[index]) {
    setAnswers((prev) => ({
      ...prev,
      [index]: null
    }));
    return;
  }

  try {

    setLoadingAnswer((prev) => ({
      ...prev,
      [index]: true
    }));

    const res = await API.post(
      "/ai/generate-answer",
      { question }
    );

    setAnswers((prev) => ({
      ...prev,
      [index]: res.data.answer
    }));

  } catch (err) {

    console.log(err);

  } finally {

    setLoadingAnswer((prev) => ({
      ...prev,
      [index]: false
    }));
  }
};
const downloadQuestionsPDF = () => {

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text(`Practice Questions Cheat Sheet for ${role}`, 20, y);

  y += 15;

  doc.setFontSize(12);

  questions.forEach((q, index) => {

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const questionText = `Q${index + 1}. ${q}`;

    const lines = doc.splitTextToSize(questionText, 170);

    doc.text(lines, 20, y);

    y += lines.length * 8 + 6;
  });

  doc.save("practice_questions.pdf");
};

  return (
    <DashboardLayout>

      <h1>Practice Mode</h1>

      <input
        placeholder="Role"
        onChange={(e) => setRole(e.target.value)}
      />

      <input
        placeholder="Domain"
        onChange={(e) => setDomain(e.target.value)}
      />

      <select
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <button onClick={generatePractice}>

        {loading ? "Generating..." : "Generate Questions"}

      </button>

      <hr />

      {questions.map((q, index) => (

  <div key={index} className="question-card">

    <p>{q}</p>

    <button
      onClick={() => fetchAnswer(q, index)}
    >
      {answers[index]
        ? "Hide Answer"
        : "See Answer"}
    </button>

    {loadingAnswer[index] && (
      <p>Loading answer...</p>
    )}

    {answers[index] && (
      <div className="answer-box">
        <p>{answers[index]}</p>
      </div>
    )}

  </div>
))}
<button onClick={downloadQuestionsPDF} disabled={questions.length===0}>
  Download Questions PDF
</button>

    </DashboardLayout>
  );
}

export default PracticePage;