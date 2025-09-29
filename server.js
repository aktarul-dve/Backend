const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routers/googleAouthLogin");
const QuestionRoutes = require("./routers/QuestionRoute");
const balance = require("./routers/balancAddRoute");
const articles = require("./routers/ArticleRoute");
const BanglaQuiz = require("./routers/BanglaQuizRoute");
const MathQuiz = require("./routers/MathQuizRoute");
const EnglishQuiz = require("./routers/EnglishQuizRoute");
const withdrawRoutes = require("./routers/withdrawRoutes");
const jobRoutes = require("./routers/jobRoutes");
const UserAction = require("./routers/UserActionRoute");
const User = require("./models/User");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// --- Socket.io ---
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://www.adcashbd.xyz"],
    credentials: true,
  },
});

// MongoDB connect
connectDB();

// Change Stream
const userChangeStream = User.watch();
userChangeStream.on("change", (change) => {
  if (change.operationType === "update") {
    const userId = change.documentKey._id;
    const updatedFields = change.updateDescription.updatedFields;

    io.emit("user_update", { userId, updatedFields });
  }
});

// Express middleware
app.use(cors({
  origin: ["https://www.adcashbd.xyz", "http://localhost:5173"],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);
app.use("/", QuestionRoutes);
app.use("/reward", balance);
app.use("/article", articles);
app.use("/bangla", BanglaQuiz);
app.use("/english", EnglishQuiz);
app.use("/math", MathQuiz);
app.use("/withdraw", withdrawRoutes);
app.use("/api/job", jobRoutes);
app.use("/action", UserAction);

// Start Server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
