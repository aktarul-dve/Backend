// routes/action.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// প্রতিটি action hit
router.post("/count", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Action count বাড়াও
    user.actionCount += 1;

    let rewardTriggered = false;

    // 10 action হলে reward trigger
    if (user.actionCount >= 10) {
      rewardTriggered = true;
      user.balance += 50; // reward টাকা
      user.actionCount = 0; // reset counter
      user.lastRewardTime = new Date();
    }

    await user.save();

    res.json({
      success: true,
      rewardTriggered,
      balance: user.balance,
      actionCount: user.actionCount
    });
  } catch (err) {
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
