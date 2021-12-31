const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { config } = require("dotenv");
const validator = require("validator");

config();

const jwtPrivateSecret = process.env.JWT_PRIVATE_KEY.replace(/\\n/g, "\n");

const UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: {
			type: String,
			required: [true, "Email is required"],
			validate: [validator.isEmail, "Please provide a valid email address"],
		},
		password: { type: String, required: [true, "Password is required"] },
		age: Number,
		//token: String,
	},
	{
		timestamps: true,
	}
);

UserSchema.pre("save", async function (next) {
	if (!this.password || !this.isModified("password")) return next;

	this.password = await bcrypt.hash(this.password, parseInt(process.env.HASH));
	next();
});

UserSchema.methods.toJSON = function () {
	const user = this;

	const userObj = user.toObject();
	delete userObj.password;
	return userObj;
};

UserSchema.methods.isValidPassword = async function (password) {
	return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateVerificationToken = function () {
	return jwt.sign({ id: this._id }, jwtPrivateSecret, {
		expiresIn: "10h",
		algorithm: "RS256",
	});
};

UserSchema.statics.checkExistingField = async (field, value) => {
	const checkField = await User.findOne({ [`${field}`]: value });

	return checkField;
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
