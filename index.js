const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const User = require("./models/user.js"); // 🔹 new
const methodOverride = require("method-override");
const session = require("express-session");
require("dotenv").config();

// Views & Middleware
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true
}));

// MongoDB
async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
main();

// Middleware for login check
function requireLogin(req, res, next) {
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
}

// Routes
app.get("/", (req, res) => {
    res.send("🚀 Root route working!");
});

// Signup
app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});
app.post("/signup", async (req, res) => {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    req.session.userId = user._id;
    res.redirect("/chats");
});

// Login
app.get("/login", (req, res) => {
    res.render("login.ejs");
});
app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if (!user) return res.send("Invalid credentials");
    req.session.userId = user._id;
    res.redirect("/chats");
});

// Logout
app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

// Chats (Protected)
app.get("/chats", requireLogin, async (req, res) => {
    let chats = await Chat.find({ owner: req.session.userId });
    res.render("index.ejs", { chats });
});

app.get("/chats/new", requireLogin, (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", requireLogin, async (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from,
        to,
        message: msg,
        owner: req.session.userId
    });
    await newChat.save();
    res.redirect("/chats");
});

// Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
