require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware should be added after app is initialized
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});

app.get("/", (req, res) => {
    res.json({ message: "API WORKING!!!" })
});

mongoose.connect("mongodb+srv://okoyedann:FhQSPJ6WJTIpGifj@cluster0.huyfpev.mongodb.net/").then(() => {
    app.listen("4000", () => {
        console.log("Connected and listening on port 4000")
    })
}).catch((error) => {
    console.log(error)
})