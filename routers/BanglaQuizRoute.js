const express = require("express");
const router = express.Router();
const Question = require("../models/banglaQuizModel");

// ✅ নতুন প্রশ্ন Add করা
router.post("/banglaQuiz", async (req, res) => {
  try {
    const { text, options, answer, reward } = req.body;

    if (!options || options.length < 2) {
      return res.status(400).json({ error: "At least 2 options are required" });
    }

    if (!options.includes(answer)) {
      return res.status(400).json({ error: "Answer must be one of the options" });
    }

    const newQuestion = new Question({ text, options, answer, reward });
    await newQuestion.save();

    res.status(201).json({ message: "Question added successfully", question: newQuestion });
  } catch (error) {
    res.status(500).json({ error: "Failed to add question" });
  }
});

// ✅ সব প্রশ্ন পাওয়া
router.get("/allBanglaQuiz", async (req, res) => {
  try {
    const questions = await Question.find();
    res.json({ success: true, questions });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

module.exports = router;
