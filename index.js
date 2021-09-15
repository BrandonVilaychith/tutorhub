require("dotenv").config();
const express = require("express");
const verifyToken = require("./middleware/authentication.js");

const app = express();

app.use(express.json());

app.get("/", (req, res) => res.send("Test working"));

app.use("/api/auth", require("./controllers/auth.js"));
app.use("/api/tutors", verifyToken, require("./controllers/tutors.js"));
app.use("/api/students", verifyToken, require("./controllers/students.js"));
app.use("/api/comments", require("./controllers/comments.js"));

module.exports = app;
