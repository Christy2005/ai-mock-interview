const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/generate-questions", async (req, res) => {
  const { role, domain, difficulty, duration } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let count;

if (duration <= 15) count = 5;
else if (duration <= 30) count = 10;
else count = 15;
    const prompt = `
You are an expert interviewer.

Generate ${count} interview questions for:

Role: ${role}
Domain: ${domain}
Difficulty: ${difficulty}

Return ONLY JSON array like:
[
  "question1",
  "question2",
  "question3"
]
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("RAW AI OUTPUT:", text);

    // convert AI string → JSON
    /*const questions = JSON.parse(
      text.replace(/```json|```/g, "").trim()
    );

    res.json({ questions });*/
    let questions;

try {
  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  console.log("CLEANED OUTPUT:", cleaned);

  questions = JSON.parse(cleaned);

  if (!Array.isArray(questions)) {
    throw new Error("AI did not return array");
  }
  return res.json({ questions });

} catch (err) {
  console.log("RAW AI OUTPUT:", text);
  return res.status(500).json({
    error: "AI response parsing failed",
    raw: text
  });
}

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "AI generation failed" });
  }
});

module.exports = router;