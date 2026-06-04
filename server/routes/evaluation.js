const express = require("express");
const router = express.Router();
const pool = require("../db");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/:interviewId", async (req, res) => {
  const { interviewId } = req.params;

  try {
    const questionsResult = await pool.query(
      `SELECT question_text, question_number
       FROM questions
       WHERE interview_id = $1
       ORDER BY question_number`,
      [interviewId]
    );

    const answersResult = await pool.query(
      `SELECT question_number, answer_text
       FROM answers
       WHERE interview_id = $1`,
      [interviewId]
    );

    const qaText = questionsResult.rows.map((q) => {
      const ans = answersResult.rows.find(
        a => a.question_number === q.question_number
      );

      return {
        questionNumber: q.question_number,
        question: q.question_text,
        answer: ans?.answer_text || ""
      };
    });

    const prompt = `
You are an expert interviewer.

Evaluate this interview:

${JSON.stringify(qaText, null, 2)}

Return ONLY valid JSON:
{
  "technical_score": 8,
  "communication_score": 7,
  "confidence_score": 6,
  "question_analysis": [
    {
      "questionNumber": 0,
      "score": 8,
      "feedback": "Good answer"
    }
  ],
  "final_feedback": "Overall performance is good"
}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const aiResult = await model.generateContent(prompt);
    const text = aiResult.response.text();

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const evaluation = JSON.parse(cleaned);

    // 🔥 ATTACH QUESTION TEXT (IMPORTANT FIX)
    evaluation.question_analysis = evaluation.question_analysis.map((item) => {
      const original = qaText.find(
        q => q.questionNumber === item.questionNumber
      );

      return {
        questionNumber: item.questionNumber,
        question: original?.question || "",
        score: item.score,
        feedback: item.feedback
      };
    });

    await pool.query(
      `INSERT INTO evaluations (
        interview_id,
        technical_score,
        communication_score,
        confidence_score,
        question_analysis,
        final_feedback
      )
      VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        interviewId,
        evaluation.technical_score,
        evaluation.communication_score,
        evaluation.confidence_score,
        JSON.stringify(evaluation.question_analysis),
        evaluation.final_feedback
      ]
    );

    res.json(evaluation);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Evaluation failed" });
  }
});
router.get("/:interviewId", async (req, res) => {
  const { interviewId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM evaluations
       WHERE interview_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [interviewId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Evaluation not found" });
    }

    const row = result.rows[0];

    let question_analysis = row.question_analysis;

    if (typeof question_analysis === "string") {
      question_analysis = JSON.parse(question_analysis);
    }

    res.json({
      ...row,
      question_analysis
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch evaluation" });
  }
});

module.exports = router;