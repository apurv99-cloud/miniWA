const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main().then(() => {
    console.log("connection successful");
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

let allChat = [{
    from: "neha",
    to: "priya",
    message: "send me your exam sheets",
    created_at: new Date() //UTC
},
{
    from: "apurv",
    to: "priya",
    message: "send me your exam sheets",
    created_at: new Date() //UTC


},
{
    from: "apurv",
    to: "rohaan",
    message: "send me your notes",
    created_at: new Date() //UTC
},
{
    from: "Shreya",
    to: "Rohit",
    message: "What's about you?",
    created_at: new Date() //UTC
},
{
    from: "Rohit",
    to: "priya",
    message: "send me class timetable",
    created_at: new Date() //UTC
},
{
    from: "Apurv",
    to: "Shania",
    message: "Height dekh ke baat kia kr",
    created_at: new Date() //UTC
},
{
    from: "Shania",
    to: "Apurv",
    message: "Aur tu meri shakal dekh ke baat kia kr",
    created_at: new Date() //UTC
},
{
    from: "apurv",
    to: "Shania",
    message: "HaHaHaHaHa",
    created_at: new Date() //UTC
}];

Chat.insertMany(allChat);

