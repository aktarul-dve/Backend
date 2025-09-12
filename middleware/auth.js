const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    // Header থেকে token নেওয়া (Bearer token)
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    // Token verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Database থেকে ইউজার খুঁজে বের করা
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // request এ user অ্যাড করা হলো
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
