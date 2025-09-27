const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    photo: { type: String },

    // নতুন ফিল্ড
    balance: { type: Number, default: 5000 }, // প্রাথমিক টাকা
    referCode: { type: String, unique: true }, // ইউনিক রেফার কোড
    actionCount: { type: Number, default: 0 }, // কতটা action হয়েছে
    lastRewardTime: { type: Date, default: null }, // শেষবার reward দেওয়া হয়েছে
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
