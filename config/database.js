const mongoose = require("mongoose");
require("dotenv").config();

const { MONGODB_URL } = process.env;

console.log("url: ", MONGODB_URL);

const dbconnect = () => {
	// Connecting to the database
	mongoose
		.connect(MONGODB_URL, {
			//useNewUrlParser: true,
			//useUnifiedTopology: true,
			//useCreateIndex: true,
			//useFindAndModify: false,
		})
		.then(() => {
			console.log("Successfully connected to database");
		})
		.catch((error) => {
			console.log("database connection failed. exiting now...");
			console.error(error);
			process.exit(1);
		});
	//mongoose.set("debug", true);
};

module.exports = dbconnect;
