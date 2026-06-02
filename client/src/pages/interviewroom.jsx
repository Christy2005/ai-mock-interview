import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/auth";
import DashboardLayout from "../layouts/DashboardLayout";
import {useNavigate} from "react-router-dom"
import "./styles/interview.css";

function InterviewRoom() {
  const { id } = useParams();
  const navigate=useNavigate();
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {

  if (timeLeft <= 0) return;

  const timer = setInterval(() => {

    setTimeLeft((prev) => prev - 1);

  }, 1000);

  return () => clearInterval(timer);

}, [timeLeft]);
useEffect(() => {

  if (timeLeft === 0 && questions.length > 0) {

    finishInterview();

  }

}, [timeLeft]);
  // ---------------- FETCH QUESTIONS ----------------
  const fetchQuestions = async () => {
    try {
      const res = await API.get(`/interview/${id}`);
      setQuestions(res.data.questions);
      setTimeLeft(res.data.duration * 60);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- SPEECH TO TEXT ----------------
  const startListening = (index) => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      setAnswer((prev) => ({
        ...prev,
        [index]: transcript,
      }));
    };

    recognition.onerror = (err) => {
      console.log("Mic error:", err);
    };

    recognition.start();
  };

  // ---------------- SAVE ANSWER ----------------
  const saveAnswer = async () => {
  setLoading(true);

  try {
    await API.post(
      "/interview/save-answer",
      {
        interviewId: id,
        answer: answer[currentIndex],
        questionNumber: currentIndex,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};
const finishInterview = async () => {

  try {

    await saveAnswer();

    await API.post(`/evaluation/${id}`);

    navigate(`/evaluation/${id}`);

  } catch (err) {

    console.log(err);
  }
};

  // ---------------- NEXT QUESTION ----------------
  const handleNext = async () => {
    try {
      await saveAnswer();
      const next=currentIndex+1;
      if (next >= questions.length) {
          await finishInterview();
          return ;
        }
        setCurrentIndex(next);
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- UI ----------------
  return (
    <DashboardLayout>
      <h1>Interview Room</h1>
      <h3>Interview ID: {id}</h3>

      {/* LOADING QUESTIONS */}
      {questions.length === 0 && <p>Loading questions...</p>}

      {/* INTERVIEW ACTIVE */}
      {questions.length > 0 && !ended && (
        <div>
        <h2 className="timer">
          Time Left:
          {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </h2>
          <h2>Question {currentIndex + 1}</h2>
         <div className="question-box">
          <p>{questions[currentIndex]}</p>

          <textarea
            //className="answer-box"
            value={answer[currentIndex] || ""}
            onChange={(e) =>
              setAnswer({
                ...answer,
                [currentIndex]: e.target.value,
              })
            }
            placeholder="Your answer..."
          />
         </div>
          <br />

          <button onClick={() => startListening(currentIndex)}>
            🎤 Speak Answer
          </button>

          <button onClick={handleNext} disabled={loading}>
            {loading ? "Saving..." : "Next Question"}
          </button>
        </div>
      )}

      {/* END SCREEN */}
      {ended && (
        <div>
          <h2>🎉 Interview Completed</h2>
          <p>Your answers are saved successfully.</p>
          <p>Next step: AI Evaluation System</p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default InterviewRoom;