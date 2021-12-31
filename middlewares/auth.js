const debug = require("debug");
const passportJWT = require("../auth/config");
const DEBUG = debug("dev");

module.exports = {
	authenticate: (req, res, next) => {
		passportJWT.authenticate("jwt", { session: false }, (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				let message = "invalid token, please log in or sign up";
				return res.status(401).json({
					status: "error",
					error: {
						message,
					},
				});
			}
			req.user = user;
			return next();
		})(req, res, next);
	},
};
