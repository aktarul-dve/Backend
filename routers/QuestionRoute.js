// routes/questionRoutes.js
const express = require("express");
const Question = require("../models/questionModel");

const router = express.Router();

// নতুন প্রশ্ন তৈরি (admin use)
router.post("/questions", async (req, res) => {
  try {
    const { text, answer ,reward  } = req.body;

    const newQuestion = new Question({ text, answer , reward });
    await newQuestion.save();

    res.status(201).json({ success: true, question: newQuestion });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", err });
  }
});

// সব প্রশ্ন পাওয়া
router.get("/allQuestions", async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json({ success: true, questions });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", err });
  }
});

module.exports = router;
