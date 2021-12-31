const User = require("../models/user");
const { Strategy } = require("passport-local");
const passport = require("passport");

const authFields = {
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true,
};

passport.use(
	"login",
	new Strategy(authFields, async (req, email, password, cb) => {
		try {
			const user = await User.findOne({
				email: email,
			});

			if (!user || !user.password) {
				return cb(null, false, {
					message: "Please enter valid email or password.",
				});
			}

			const isValidPassword = await user.isValidPassword(password);

			if (!isValidPassword) {
				return cb(null, false, { message: "Invalid password." });
			}
			return cb(null, user, { message: "Logged In Successfully" });
		} catch (err) {
			DEBUG(err);
			return cb(null, false, { statusCode: 400, message: err.message });
		}
	})
);

passport.use(
	"signup",
	new Strategy(authFields, async (req, email, password, cb) => {
		try {
			const user = await User.findOne({
				email: email,
			});

			if (user) {
				return cb(null, false, {
					statusCode: 409,
					message: "Sorry this email is already registered",
				});
			}

			const newUser = new User();
			newUser.name = req.body.name;
			newUser.email = req.body.email;
			newUser.password = req.body.password;
			if (typeof req.body["age"] != "undefined") {
				newUser.age = req.body.age;
			}
			await newUser.save();
			return cb(null, newUser);
		} catch (err) {
			console.log(err);
			return cb(null, false, { statusCode: 400, message: err.message });
		}
	})
);

module.exports = passport;
