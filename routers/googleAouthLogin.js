const express = require("express");
const passport = require("passport");
const jwt = require('jsonwebtoken');


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
        failureRedirect: "http://localhost:5173",
    }),
    (req, res) => {
        // Google থেকে পাওয়া user
        const user = req.user;

        // JWT token তৈরি
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Token সহ redirect
        res.redirect(`http://localhost:5173/?token=${token}`);
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
        res.redirect("http://localhost:5173");
    });
});

module.exports = router;
