// middleware/checkCooldown.js
module.exports = (req, res, next) => {
  const user = req.user; // authMiddleware থেকে পাওয়া user

  if (user.lastCompletedTime) {
    const now = Date.now();
    const diff = now - new Date(user.lastCompletedTime).getTime();
    const fourHours = 4 * 60 * 60 * 1000; // 4 ঘন্টা ms এ

    if (diff < fourHours) {
      const remaining = Math.ceil((fourHours - diff) / 1000); // সেকেন্ডে বাকি সময়
      return res.status(400).json({
        success: false,
        message: `⏳ আবার কাজ করতে পারবেন ${Math.floor(
          remaining / 3600
        )}h ${Math.floor((remaining % 3600) / 60)}m পরে`,
        remaining,
      });
    }
  }

  next();
};
