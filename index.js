const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
require("dotenv").config();

// Set EJS views and public folder
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Database connection
async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected successfully");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err);
    }
}
main();

// Routes
app.get("/", (req, res) => {
    res.send("🚀 Root route is working on Render!");
});

app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
});

app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

app.post("/chats", async (req, res) => {
    try {
        let { from, to, msg } = req.body;
        let newChat = new Chat({
            from,
            to,
            message: msg,
            created_at: new Date()
        });

        await newChat.save();
        console.log("✅ Chat was saved");
        res.redirect("/chats");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving chat");
    }
});

// EDIT ROUTE
app.get("/chats/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        id = id.trim();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Chat ID");
        }

        let chat = await Chat.findById(id);
        if (!chat) return res.status(404).send("Chat not found");

        res.render("edit.ejs", { chat });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// UPDATE ROUTE
app.put("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        id = id.trim();
        let { msg: newMsg } = req.body;

        let updatedChat = await Chat.findByIdAndUpdate(
            id,
            { message: newMsg },
            { runValidators: true, new: true }
        );

        console.log("✅ Chat updated:", updatedChat);
        res.redirect("/chats");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating chat");
    }
});

// Port setup for Render
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is listening on port ${PORT}`);
});
