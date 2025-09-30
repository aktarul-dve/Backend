const express = require("express");
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const googleStrategy = require("passport-google-oauth20").Strategy;
import { v2 as cloudinary } from 'cloudinary';
import fileUpload from "express-fileupload";


const authRoutes = require("./routers/googleAouthLogin"); 
const QuestionRoutes = require("./routers/QuestionRoute"); 
const balance = require ("./routers/balancAddRoute") 
const articles = require ("./routers/ArticleRoute") 
const BanglaQuiz = require ("./routers/BanglaQuizRoute") 
const MathQuiz = require ("./routers/MathQuizRoute") 
const EnglishQuiz = require ("./routers/EnglishQuizRoute") 
const withdrawRoutes = require ("./routers/withdrawRoutes")
const jobRoutes = require("./routers/jobRoutes");
const User = require("./models/User");
const connectDB = require ('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;


// Connect DB
connectDB();

// --- CORS Middleware ---
app.use(cors({

    origin: ['https://www.adcashbd.xyz',
      'http://localhost:5173'],
    credentials: true,
}));

// Express middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Session & Cookies
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },

  origin: ['https://www.adcashbd.xyz', 'http://localhost:5173'],
  credentials: true,
}));

// --- Express Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// --- Session & Cookies ---
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }

}));
app.use(cookieParser());

app.use(fileUpload({

  useTempFiles:true,
  tempFileDir:"/tmp/",


}))

// --- Passport Config ---
app.use(passport.initialize());
app.use(passport.session());


// --- রেফার কোড জেনারেটর ---
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

// --- Google Strategy ---
passport.use(

    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'https://aktarul.onrender.com/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
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
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Routes
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'https://aktarul.onrender.com/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
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
    }
  )


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});


app.use("/auth", authRoutes);
app.use("/", QuestionRoutes );
app.use("/reward", balance );
app.use("/article", articles );
app.use("/bangla", BanglaQuiz);
app.use("/english", EnglishQuiz);
app.use("/math", MathQuiz);

//withdraw
app.use("/withdraw", withdrawRoutes);

app.use("/api/job", jobRoutes);

//Cloudinary

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_API_KEY,  
  api_secret: process.env.CLOUD_SECRET_KEY, 
});


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});  




