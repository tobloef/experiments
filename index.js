const path = require("path");
const express = require("express");
const ejs = require("ejs");
const poetry = require("./poetry");

const PORT = 3000;

const app = express();

app.set("views", __dirname);
app.set("view engine", "ejs");

app.get("/poetry", (req, res) => {
	const poem = poetry.generate();
	res.render("poetry/index", { poem });
});

app.listen(PORT, async () => {
	console.info("Initializing...");
	await poetry.initialize();
	console.info(`Started server on port ${PORT}.`);
});
