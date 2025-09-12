// models/Question.js
const mongoose = require("mongoose");

const WatchAdsModel = new mongoose.Schema({
  text: { type: String, required: true },      // প্রশ্ন
  reward: { type: Number, default: 0.20 },     // ✅ প্রতি প্রশ্নের reward (default 0.20 টাকা)
});

const WatchAds = mongoose.model("WatchAds", WatchAdsModel);
module.exports = WatchAds;
