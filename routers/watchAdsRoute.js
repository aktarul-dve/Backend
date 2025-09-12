// routes/questionRoutes.js
const express = require("express");
const WatchAds = require("../models/watchAdsModel");

const router = express.Router();

// নতুন প্রশ্ন তৈরি (admin use)
router.post("/wathchAds", async (req, res) => {
  try {
    const { text, reward  } = req.body;

    const newWathchAds = new WatchAds({ text, reward });
    await newWathchAds.save();

    res.status(201).json({ success: true, wathchAds: newWathchAds });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", err });
  }
});

router.get("/allWatchAds", async (req, res) => {
  try {
    const watchAds = await WatchAds.find();
    res.status(200).json({ success: true, watchAds });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", err });
  }
});

module.exports = router;
