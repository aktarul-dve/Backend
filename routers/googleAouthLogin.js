const express = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middleware/auth");


const router = express.Router();

// Google Login শুরু
router.get("/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
        prompt: "select_account",
    })
);

// Callback
router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "https://gadget-review-y7lm.vercel.app",
    }),
    (req, res) => {
        // Google থেকে পাওয়া user
        const user = req.user;

        // JWT token তৈরি
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Token সহ redirect
        res.redirect(`https://gadget-review-y7lm.vercel.app/?token=${token}`);
    }
);


// Login Success
router.get("/login/success", (req, res) => {
    if (req.user) {
        res.status(200).json({
            message: "Login Successful",
            user: req.user,
        });
    } else {
        res.status(400).json({ message: "Not Authenticated" });
    }
});

// Logout
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout Error", err });
        }
        res.redirect("https://gadget-review-y7lm.vercel.app");
    });
});


// Profile API
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    photo: req.user.photo,
    balance: req.user.balance,
    referCode: req.user.referCode,
  });
});

module.exports = router;
