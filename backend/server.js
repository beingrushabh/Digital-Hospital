const path = require("path");
const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Blog = require("./models/blogs");

const morgan = require("morgan");

const dotenv = require("dotenv").config();
const expand = require("dotenv-expand");
expand(dotenv);

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);

app.use(morgan("short"));
app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "../frontend/html/index.html"));
});

app.get("/api/blogs", (req, res) => {
	Blog.find().then((result) => {
		console.log(result);
		res.json(result);
	});
});

app.post("/api/blogs", (req, res) => {
	const body = req.body;

	if (!body.author || !body.title || !body.content) res.status(400).send("Wrong Format.");

	new Blog({
		title: body.title,
		content: body.content,
		date: new Date().toISOString(),
		author: body.author,
	}).save();

	res.send(body);
});

mongoose
	.connect("mongodb://localhost:27017/digiHospital", {
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		const PORT = process.env.PORT || 4769;

		app.listen(PORT, (err) => {
			if (err) {
				console.log(err);
				return;
			}

			console.log("Listening to PORT => ", PORT);
		});
	})
	.catch((err) => {
		console.log(err);
	});
