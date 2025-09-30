const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const { v2: cloudinary } = require("cloudinary");
const fileUpload = require("express-fileupload");

// Routes
const authRoutes = require("./routers/googleAouthLogin");
const QuestionRoutes = require("./routers/QuestionRoute");
const balanceRoutes = require("./routers/balancAddRoute");
const articlesRoutes = require("./routers/ArticleRoute");
const BanglaQuizRoutes = require("./routers/BanglaQuizRoute");
const MathQuizRoutes = require("./routers/MathQuizRoute");
const EnglishQuizRoutes = require("./routers/EnglishQuizRoute");
const withdrawRoutes = require("./routers/withdrawRoutes");
const jobRoutes = require("./routers/jobRoutes");

// Models & DB
const User = require("./models/User");
const connectDB = require("./config/db");

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

// Connect DB
connectDB();

// --- Middleware ---
app.use(cors({
    origin: ['https://www.adcashbd.xyz', 'http://localhost:5173'],
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

app.use(cookieParser());

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));

// --- Cloudinary Config ---
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET_KEY,
});

// --- Refer Code Generator ---
function generateReferCode(length = 8) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function createUniqueReferCode() {
    let code;
    let exists = true;
    while (exists) {
        code = generateReferCode();
        exists = await User.findOne({ referCode: code });
    }
    return code;
}

// --- Passport Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://aktarul.onrender.com/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value,
                balance: 50,
                referCode: await createUniqueReferCode(),
            });
            await user.save();
        }
        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

app.use(passport.initialize());
app.use(passport.session());

// --- Routes ---
app.use("/auth", authRoutes);
app.use("/", QuestionRoutes);
app.use("/reward", balanceRoutes);
app.use("/article", articlesRoutes);
app.use("/bangla", BanglaQuizRoutes);
app.use("/english", EnglishQuizRoutes);
app.use("/math", MathQuizRoutes);
app.use("/withdraw", withdrawRoutes);
app.use("/api/job", jobRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
