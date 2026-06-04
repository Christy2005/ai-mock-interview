const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/create-with-questions", verifyToken,async (req, res) => {
  //req.user=decodedUser;
  const userId=req.user.userId;
  const { role, domain, difficulty, duration, questions } = req.body;
  try {
    // 1. create interview
    const interview = await pool.query(
      `INSERT INTO interviews (user_id,role, domain, difficulty, duration)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [userId, role, domain, difficulty, duration]
    );

    const interviewId = interview.rows[0].id;

    // 2. SAVE QUESTIONS (THIS IS THE IMPORTANT PART YOU MISSED)
    for (let i = 0; i < questions.length; i++) {
      await pool.query(
        `INSERT INTO questions (interview_id, question_text, question_number)
         VALUES ($1,$2,$3)`,
        [interviewId, questions[i], i]
      );
    }

    res.json({ id: interviewId });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/history", verifyToken, async (req, res) => {

  try {
    const userId=req.user.userId;
    const result = await pool.query(
      `SELECT i.id, i.role, i.domain, i.created_at,
              e.technical_score, e.communication_score, e.confidence_score
       FROM interviews i
       LEFT JOIN evaluations e ON i.id = e.interview_id
       where i.user_id=$1
       ORDER BY i.id DESC`,
       [userId]
    );
    /*const result = await pool.query(
      `SELECT * FROM interviews ORDER BY id DESC`
    );*/

    res.json(result.rows);

  } catch (err) {

    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/:id", async (req, res) => {
  const interviewId = req.params.id;

  try {
    const interviewResult = await pool.query(
      `SELECT * FROM interviews
       WHERE id = $1`,
      [interviewId]
    );

    const result = await pool.query(
      `SELECT question_text 
       FROM questions 
       WHERE interview_id = $1 
       ORDER BY question_number`,
      [interviewId]
    );

    res.json({
      duration: interviewResult.rows[0].duration,
      questions: result.rows.map(row => row.question_text)
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});
router.post("/save-answer", async (req, res) => {
  const { interviewId, answer, questionNumber } = req.body;

  try {
    await pool.query(
      `INSERT INTO answers (interview_id, question_number, answer_text)
       VALUES ($1, $2, $3)`,
      [interviewId, questionNumber, answer]
    );

    res.json({ message: "Saved" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", verifyToken, async (req, res) => {
  const interviewId = req.params.id;
 const userId=req.user.userId;
  try {

    // delete answers
    await pool.query(
      `DELETE FROM answers WHERE interview_id = $1`,
      [interviewId]
    );

    // delete questions
    await pool.query(
      `DELETE FROM questions WHERE interview_id = $1`,
      [interviewId]
    );

    // delete evaluations
    await pool.query(
      `DELETE FROM evaluations WHERE interview_id = $1`,
      [interviewId]
    );

    // delete interview
    await pool.query(
      `DELETE FROM interviews WHERE id = $1 AND user_id=$2`,
      [interviewId,userId]
    );

    res.json({
      message: "Interview deleted"
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      error: "Delete failed"
    });
  }
});


module.exports = router;