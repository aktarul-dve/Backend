// models/Question.js
const mongoose = require("mongoose");

const ArticleModel = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Image: { type: String }, // এখানে image URL রাখবেন
});

const Article = mongoose.model("Article", ArticleModel);
module.exports = Article;
