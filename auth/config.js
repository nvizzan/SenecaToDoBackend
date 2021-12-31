const passport = require("passport");
const { ExtractJwt, Strategy } = require("passport-jwt");
const { config } = require("dotenv");
const User = require("../models/user");

config();

const jwtPublicSecret = process.env.JWT_PUBLIC_KEY.replace(/\\n/g, "\n");

const options = {
	secretOrKey: jwtPublicSecret,
	algorithms: ["RS256"],
	passReqToCallback: true,
};

options.jwtFromRequest = ExtractJwt.fromExtractors([
	ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

passport.use(
	new Strategy(options, (req, jwtPayload, done) => {
		User.findOne({ _id: jwtPayload.id })
			.then((user) => {
				if (user) {
					delete user._doc.password;
					done(null, user);
				} else {
					done(null, false);
				}
			})
			.catch((err) => {
				if (err) {
					return done(err, false);
				}
			});
	})
);

module.exports = passport;
