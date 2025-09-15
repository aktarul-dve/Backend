const fetch = require("node-fetch");

const checkCountry = async (req, res, next) => {
  try {
    // ইউজারের IP নেওয়া
    let ip =
      req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.socket.remoteAddress;

    // Localhost / Internal IP fallback
    if (ip === "::1" || ip === "127.0.0.1" || ip?.startsWith("::ffff:10.")) {
      ip = ""; // ipapi নিজের public IP detect করবে
    }


    // ipapi থেকে country ফেচ করা
    console.log("🌍 Detected IP:", ip);
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    console.log("🌍 ipapi response:", data);
    const country = data.country_name; // Example: "United States"

    // যদি country USA না হয় তাহলে error দিবে
    if (country !== "United States") {
      return res.status(403).json({
        success: false,
        message: "👉 আগে USA country দিয়ে কাজ করুন।",
      });
    }

    // Country ঠিক থাকলে next() দিয়ে route এ পাঠাবে
    next();
  } catch (error) {
    console.error("Country check error:", error);
    return res.status(500).json({
      success: false,
      message: "Country চেক করতে সমস্যা হয়েছে।",
    });
  }
};

module.exports = checkCountry;
