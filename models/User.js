const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    name: { type: String },
    email: { type: String },
    photo: { type: String },

    // নতুন ফিল্ড
    balance: { type: Number, default: 50 }, // প্রাথমিক টাকা
    referCode: { type: String, unique: true }, // ইউনিক রেফার কোড
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
