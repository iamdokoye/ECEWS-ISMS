require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
const app = express();

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

app.get("/", (req, res) => {
    res.json({ message: "API WORKING!!!" })
});

mongoose.connect("").then(() => {
    app.listen("4000", () => {
        console.log("Connected and listening on port 4000")
    })
}).catch((error) => {
    console.log(error)
})