const express = require("express");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");
const countdown = require("../middleware/checkCooldown");

const router = express.Router();

// ইউজারের balance update করা
// Update Balance (in taka/poisha)
router.put("/balance", authMiddleware, countdown, async (req, res) => {
  try {
    const { amount } = req.body; // যেমন 0.30, 0.20

    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    // পয়সায় convert করা হলো
    const amountInPoisha = Math.round(amount * 100);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += amountInPoisha;
    user.lastCompletedTime = Date.now(); // এখানে সময় সেট করা হলো
    await user.save();

    res.json({
      message: "Balance updated",
      balance: (user.balance / 100).toFixed(2), // টাকা আকারে ফেরত দিবো
      nextAvailable: new Date(Date.now() + 4 * 60 * 60 * 1000), // কখন আবার কাজ করতে পারবে
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



module.exports = router;
