const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))) // for add styling
app.use(express.urlencoded({ extended: true })); // for getting post requests
app.use(methodOverride("_method"));

main().then(() => {
    console.log("connection successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// let chat1 = new Chat({
//     from: "neha",
//     to: "priya",
//     message: "send me your exam sheets",
//     created_at: new Date() //UTC
// });

// chat1.save().then((res) => {
//     console.log(res);
// }).catch((err) => {
//     console.log(err);
// });

app.get("/chats", async (req, res) => {
    let chats = await Chat.find();
    console.log(chats);
    res.render("index.ejs", { chats });
})

// NEW ROUTE GET AND POST
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");

})

// POST 
app.post("/chats", (req, res) => {
    let { from, to, msg } = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        message: msg,
        created_at: new Date()


    });
    // console.log(newChat);
    newChat //  JAHAAN HUM THEN USE KRTE HAI VHAA AWAIT AUR ASYNC USE NHI KRRNA HAI
        .save()
        .then(res => {
            console.log("chat weas saved")
        }).catch((err) => {
            console.log(err);
        })
    res.redirect("/chats");
})

// EDIT ROUTE
app.get("/chats/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;

        id = id.trim();  // ✅ Remove any whitespace

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Chat ID");
        }

        let chat = await Chat.findById(id);

        if (!chat) {
            return res.status(404).send("Chat not found");
        }

        res.render("edit.ejs", { chat });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// UPDATE ROUTE
app.put("/chats/:id", async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    let {msg: newMsg } = req.body;
    console.log(newMsg);
    let updatedChat = await Chat.findByIdAndUpdate(id,
        { message: newMsg },
        { runValidators: true, new: true }
    );
    console.log(updatedChat);
    res.redirect("/chats");

});


app.get("/", (req, res) => {
    res.send("root is working");

});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});