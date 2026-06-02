const express = require("express");
const router = express.Router();
const pool = require("../db");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/:interviewId", async (req, res) => {

  const { interviewId } = req.params;

  try {

    // 1. GET QUESTIONS + ANSWERS
    const result = await pool.query(
      `SELECT q.question_text, a.answer_text
       FROM questions q
       JOIN answers a
       ON q.interview_id = a.interview_id
       AND q.question_number = a.question_number
       WHERE q.interview_id = $1`,
      [interviewId]
    );

    const qaText = result.rows.map((item, index) => `
Question ${index + 1}:
${item.question_text}

Answer:
${item.answer_text}
`).join("\n\n");

    // 2. AI PROMPT
    const prompt = `
You are an expert technical interviewer.

Evaluate this interview.

${qaText}

Return ONLY valid JSON in this format:
Return JSON like:

{
  "technical_score": 8,
  "communication_score": 7,
  "confidence_score": 6,
  "question_analysis": [
    {
      "questionNumber": 0,
      "score": 8,
      "feedback": "Good answer but missing edge cases"
    },
    {
      "questionNumber": 1,
      "score": 6,
      "feedback": "Concept unclear"
    }
  ],
  "final_feedback": "Overall decent performance..."
}
`;

    // 3. CALL GEMINI
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const aiResult = await model.generateContent(prompt);
    const response = await aiResult.response;
    const text = response.text();

    // 4. CLEAN JSON
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const evaluation = JSON.parse(cleaned);

    // 5. SAVE TO DB
   /* await pool.query(
      `INSERT INTO evaluations
      (
        interview_id,
        technical_score,
        communication_score,
        confidence_score,
        strengths,
        weaknesses,
        improvements,
        final_feedback
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [
        interviewId,
        evaluation.technicalScore,
        evaluation.communicationScore,
        evaluation.confidenceScore,
        evaluation.strengths,
        evaluation.weaknesses,
        evaluation.improvements,
        evaluation.finalFeedback
      ]
    );*/
    await pool.query(
  `INSERT INTO evaluations 
  (interview_id, technical_score, communication_score, confidence_score, question_analysis, final_feedback)
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

    // 6. SEND RESPONSE
    res.json(evaluation);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Evaluation failed"
    });
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
      return res.status(404).json({
        error: "Evaluation not found"
      });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Failed to fetch evaluation"
    });
  }
});

module.exports = router;