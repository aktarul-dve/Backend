// models/Question.js
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },      // প্রশ্ন
  answer: { type: String, required: true },    // সঠিক উত্তর
  reward: { type: Number, default: 0.20 },     // ✅ প্রতি প্রশ্নের reward (default 0.20 টাকা)
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
