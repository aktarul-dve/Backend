const express = require("express");
const checkCountry = require("../middleware/checkCountry");

const router = express.Router();

// Example: math কাজ করার রুট
router.get("/math", checkCountry, (req, res) => {
  res.json({ success: true, message: "✅ Math কাজ শুরু করতে পারেন।" });
});

// Example: spin কাজ করার রুট
router.get("/spin", checkCountry, (req, res) => {
  res.json({ success: true, message: "✅ Spin Wheel শুরু করতে পারেন।" });
});

// Example: ads কাজ করার রুট
router.get("/ads", checkCountry, (req, res) => {
  res.json({ success: true, message: "✅ Ads দেখতে পারেন।" });
});

module.exports = router;
