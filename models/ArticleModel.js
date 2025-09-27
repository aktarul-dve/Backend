// models/Question.js
const mongoose = require("mongoose");

const ArticleModel = new mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  
});

const Article = mongoose.model("Article", ArticleModel);
module.exports = Article;
