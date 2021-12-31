const passport = require("passport");
const debug = require("debug");
//import passportLocal from "../auth/auth";
const DEBUG = debug("dev");

exports.register = async (req, res, next) => {
	passport.authenticate(
		"signup",
		{ session: false },
		async (err, user, info) => {
			try {
				if (err || !user) {
					const { statusCode = 400, message } = info;

					return res.status(statusCode).json({
						status: "error",
						error: {
							message,
						},
					});
				}

				const token = user.generateVerificationToken();

				res.status(201).json({
					user,
					token,
				});
			} catch (error) {
				DEBUG(error);
				throw new ApplicationError(500, error);
			}
		}
	)(req, res, next);
};

exports.login = (req, res, next) => {
	passport.authenticate("login", { session: false }, (err, user, info) => {
		if (err || !user) {
			let message = err;

			if (info) {
				message = info.message;
			}

			return res.status(401).json({
				status: "error",
				error: {
					message,
				},
			});
		}

		const token = user.generateVerificationToken();

		res.status(200).json({
			user,
			token,
		});
	})(req, res, next);
};
