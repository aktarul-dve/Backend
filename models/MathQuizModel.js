// models/Question.js
const mongoose = require("mongoose");

const mathQuizSchema = new mongoose.Schema({
  text: { type: String, required: true },      // প্রশ্ন
  options: [{ type: String, required: true }], // ✅ Multiple choice options
  answer: { type: String, required: true },    // সঠিক উত্তর (options এর মধ্যে একটা)
  reward: { type: Number, default: 0.20 },     // প্রতি প্রশ্নের reward
});

const MathQuiz = mongoose.model("MathQuiz", mathQuizSchema);
module.exports = MathQuiz;
