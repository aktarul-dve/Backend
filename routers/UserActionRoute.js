const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");

// Action hit
router.post("/count", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.actionCount += 1;
    let rewardTriggered = false;

    if (user.actionCount >= 10) {
      rewardTriggered = true;
      user.actionCount = 0;
      user.lastRewardTime = new Date();
    }

    await user.save();

    // Emit to user-specific room
    const io = req.app.get("io");
    io.to(user._id.toString()).emit("user_update", {
      userId: user._id.toString(),
      updatedFields: {
        actionCount: user.actionCount,
       
      }
    });

    res.json({
      success: true,
      rewardTriggered,
      actionCount: user.actionCount,
     
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
