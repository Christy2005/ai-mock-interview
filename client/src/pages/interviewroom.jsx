import { useEffect, useState,useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/auth";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
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
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef=useRef(null);
  const [saving,setSaving]=useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

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
    recognition.continuous = true;
    recognition.interimResults = true;
   let finalTranscript="";
    recognition.onresult = (event) => {
       let transcript = "";

    for (let i = 0; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }
    finalTranscript=transcript;
    setAnswer((prev) => ({
      ...prev,
      [currentIndex]: transcript,
    }));
    };

    recognition.onerror = (err) => {
      console.log("Mic error:", err);
    };
  recognition.start();
  recognitionRef.current = recognition;
  setIsRecording(true);
  };

  const stopRecording = () => {
  if (recognitionRef.current) {
    recognitionRef.current.stop();
    recognitionRef.current = null;
  }

  setIsRecording(false);
};
const handleRecordToggle = () => {
  if (isRecording) {
    stopRecording();
  } else {
    startListening();
  }
};
  // ---------------- SAVE ANSWER ----------------
  const saveAnswer = async () => {
    if(saving) return;
    setSaving(true);
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
    setSaving(false);
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
     if (isNextDisabled) return; // 🔥 prevent spam clicks

  setIsNextDisabled(true);

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
    }finally{
      setIsNextDisabled(false);
    }
  };
  const speakQuestion = (text) => {

  const speech = new SpeechSynthesisUtterance(text);

  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
};
useEffect(() => {

  if (questions.length > 0) {

    window.speechSynthesis.cancel();

    speakQuestion(questions[currentIndex]);

  }

}, [currentIndex, questions]);

  // ---------------- UI ----------------
  return (
    <DashboardLayout>
      <h1>Interview Room</h1>
      
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
         <div className="button-container">
          <button
          onClick={handleRecordToggle}
          style={{
            background: isRecording ? "red" : "green",
            color: "white",
          }}
        >
          {isRecording ? "⏹ Stop Recording" : "🎤 Start Recording"}
        </button>

          <button onClick={handleNext} disabled={saving || isNextDisabled}>
  {saving
    ? "Saving..."
    : currentIndex === questions.length - 1
    ? "Submit"
    : "Next"}
</button>
<br />
          </div>
          <div className="question-nav">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={i === currentIndex ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
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