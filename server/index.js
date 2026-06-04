const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/auth");
const verifyToken = require("./middleware/auth");
const interviewRoutes = require("./routes/interview");
const questionRoutes = require("./routes/question");
const aiRoutes = require("./routes/question");
const evaluationRoutes= require("./routes/evaluation");
const chatRoutes=require("./routes/chat");


const app = express();

app.use(cors({
  origin: "https://ai-mock-interview-zdjq.onrender.com",
  credentials: true
}));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/chat",chatRoutes);
app.use("/interview", interviewRoutes);
app.use("/ai", aiRoutes);
app.use("/evaluation",evaluationRoutes);

const pool = require("./db");

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("AI Interview Backend Running with Neon DB");
});
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "You accessed protected data",
    user: req.user
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});