const express = require("express");
const router = express.Router();
const Withdraw = require("../models/Withdraw");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

// Withdraw request তৈরি
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { method, phone, amount } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Check balance
    if (amount > user.balance) {
      return res.status(400).json({ message: "Balance not enough" });
    }

    // মিনিমাম চেক
    if (method === "mobile" && amount < 20) {
      return res.status(400).json({ message: "Mobile recharge min 20 tk" });
    }
    if (method === "bkash" && amount < 300) {
      return res.status(400).json({ message: "Bkash transfer min 300 tk" });
    }

    // Withdraw তৈরি
    const withdraw = new Withdraw({
      user: user._id,
      method,
      phone,
      amount,
    });

    await withdraw.save();

    // ইউজারের balance থেকে টাকা কেটে নেওয়া
    user.balance -= amount;
    await user.save();

    res.json({ message: "Withdraw request submitted", withdraw });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ইউজারের withdraw history
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const withdraws = await Withdraw.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(withdraws);
  } catch (err) {
    console.error("Fetch withdraw error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
