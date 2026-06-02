const express = require("express");

const router = express.Router();

const {
  GoogleGenerativeAI
} = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

router.post("/", async (req, res) => {

  try {

    const { message } = req.body;

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });
      const prompt = `
You are an AI Interview Coach inside a mock interview platform.

Your job is ONLY to help users prepare for interviews.

RULES:
- Keep answers VERY SHORT (max 5–7 lines)
- Do NOT give long explanations
- Do NOT write essays or documentation
- Use simple language
- Prefer bullet points (max 4 bullets)
- Focus only on interview-relevant information
- If question is "explain X", give ONLY key points
- If question is simple, give short direct answer

FORMAT:
- Answer in short bullets or 2–3 lines max
- End with 1 quick interview tip if relevant

User question:
${message}
`;

    const result =
      await model.generateContent(prompt);

    const response = await result.response;

    const text = response.text();

    res.json({
      reply: text
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Chatbot failed"
    });
  }
});

module.exports = router;