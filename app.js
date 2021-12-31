const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const errorHandler = require("errorhandler");
const passport = require("./auth/auth");
const { config } = require("dotenv");
const dbconnect = require("./config/database");
const debug = require("debug");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");
const taskRouter = require("./routes/todo");
var app = express();

config();
const DEBUG = debug("dev");

const isProduction = process.env.NODE_ENV === "production";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
	session({
		secret: "seneca-todo-x010",
		cookie: { maxAge: 60000 },
		resave: false,
		saveUninitialized: false,
	})
);

passport.initialize();

app.use(indexRouter);
app.use("/user", usersRouter);
app.use(taskRouter);

dbconnect();
mongoose.Promise = global.Promise;

if (!isProduction) {
	app.use(errorHandler());
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	//next(createError(404));

	let err = { message: "404 Page not Found" };
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

// error handler
app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	res.status(err.status || 500);
	res.render("error");
});

process.on("SIGINT", function () {
	mongoose.connection.close(function () {
		console.log(
			"Mongoose default connection disconnected through app termination"
		);
		process.exit(0);
	});
});

process.on("uncaughtException", (error) => {
	DEBUG(`uncaught exception: ${error.message}`);
	process.exit(1);
});

process.on("unhandledRejection", (err) => {
	DEBUG(err);
	DEBUG("Unhandled Rejection:", {
		name: err.name,
		message: err.message || err,
	});
	process.exit(1);
});

module.exports = app;
