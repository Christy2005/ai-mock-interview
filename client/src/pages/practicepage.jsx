import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import API from "../api/auth";
import "./styles/practice.css";

function PracticePage() {

  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);

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

        <div key={index}>

          <h3>
            Question {index + 1}
          </h3>

          <p>{q}</p>

        </div>
      ))}

    </DashboardLayout>
  );
}

export default PracticePage;