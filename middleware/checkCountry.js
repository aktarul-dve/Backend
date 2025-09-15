const fetch = require("node-fetch");

const checkCountry = async (req, res, next) => {
  try {
    // ইউজারের IP নেওয়া

    let ip = req.headers["x-forwarded-for"]?.split(",")[0].trim() || req.ip;

    // Localhost / Internal IP fallback
    if (ip === "::1" || ip === "127.0.0.1") ip = "";


    const country = data.country_name;
    console.log("🌍 Client Country:", country, ip);

    if (country !== "United States") {
      return res.status(403).json({
        success: false,
        message: "❌ VPN ছাড়া কাজ করা যাবে না। USA IP ব্যবহার করুন।",
      });
    }

    // Country ঠিক থাকলে next() দিয়ে route এ পাঠাবে
    next();
  } catch (error) {
    console.error("Country check error:", error);
     return res.status(500).json({
      success: false,
      message: "Country check করতে সমস্যা হয়েছে।",
    });
  }
};

module.exports = checkCountry;
