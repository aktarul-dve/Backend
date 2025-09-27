// routes/questionRoutes.js
const express = require("express");
const Article = require("../models/ArticleModel");

const router = express.Router();

// নতুন প্রশ্ন তৈরি (admin use)
router.post("/newArticle", async (req, res) => {
  try {
    const { Title, Description  } = req.body;

    const newarticle = new Article({ Title, Description });
    await newarticle.save();

    res.status(201).json({ success: true, article: newarticle });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", err });
  }
});

router.get("/allarticle", async (req, res) => {
  try {
    const article = await Article.find();
    res.status(200).json({ success: true, article });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", err });
  }
});

module.exports = router;
