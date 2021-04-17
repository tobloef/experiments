const path = require("path");
const express = require("express");
const ejs = require("ejs");
const minimist = require("minimist");
const poetry = require("./poetry");

const argv = minimist(process.argv.slice(2));

const PORT = argv.port || 3000;
const BASE_PATH = argv.basePath || "/";

const app = express();

app.set("views", __dirname);
app.set("view engine", "ejs");
app.use(BASE_PATH, (() => {
	const router = express.Router();

	router.get("/", (req, res) => {
		res.render("index", { basePath: BASE_PATH + "/" });
	});

	router.get("/poetry", (req, res) => {
		const poem = poetry.generate();
		res.render("poetry/index", { poem });
	});

	return router;
})());

app.listen(PORT, async () => {
	console.info("Initializing...");
	await poetry.initialize();
	console.info(`Started server on port ${PORT} with base path ${BASE_PATH}.`);
});
