const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    photo: { type: String },

    // নতুন ফিল্ড
    balance: { type: Number, default: 5000 }, // প্রাথমিক টাকা
    referCode: { type: String, unique: true }, // ইউনিক রেফার কোড
    lastCompletedTime: { type: Date, default: null }, // শেষবার কাজের সময়
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
