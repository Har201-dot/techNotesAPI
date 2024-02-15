const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = require("./config/dbConn");

console.log("Mode:", process.env.NODE_ENV);

const PORT = process.env.PORT || 3500;
connectDB();

app.use(express.json());

// logs for morgan
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir);
}
const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), { flags: "a" });
app.use(morgan("combined", { stream: accessLogStream }));
app.use(morgan("tiny"));

// Allow requests only from specified origins
app.use(
	cors({
		origin: ["http://localhost:3000", "https://tech-notes-dashboard.vercel.app"], // Change to your React frontend URL
		credentials: true, // Allow sending cookies and other credentials
	})
);

app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
app.use("/users", require("./routes/userRoutes"));
app.use("/notes", require("./routes/noteRoutes"));
app.use("/auth", require("./routes/authRoutes"));

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 not found" });
	} else {
		res.type("txt").send("404 not found");
	}
});

mongoose.connection.once("open", () => {
	console.log("Connected to mongo db");
	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on("error", (err) => {
	console.log(err);
});
