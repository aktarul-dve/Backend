// routes/questionRoutes.js
const express = require("express");
const Article = require("../models/ArticleModel");
const { v2: cloudinary } = require('cloudinary');


const router = express.Router();

// নতুন প্রশ্ন তৈরি (admin use)
router.post("/newArticle", async (req, res) => {
  try {

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("no image");
      return res.status(400).json({ message: "User photo is required" });
    }

    const { photo } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedFormats.includes(photo.mimetype)) {
      return res.status(400).json({ message: "Invalid photo format. Only jpg and png are allowed" });
    }
    const { Title, Description } = req.body;

    const cloudinaryResponse = await cloudinary.uploader.upload(photo.tempFilePath);

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.log(cloudinaryResponse.error);
      return res.status(500).json({ message: "Error uploading photo" });
    }

    const newarticle = new Article({
      Title,
      Description,
      photo: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.url,
      }
    });
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
