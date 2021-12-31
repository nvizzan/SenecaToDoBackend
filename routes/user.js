const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const { authenticate } = require("../middlewares/auth");

/* GET users listing. */
router.get("/", function (req, res, next) {
	res.status(200).send({ msg: "respond with a resource" });
});

router.post("/register", UserController.register);
router.post("/login", UserController.login);

router.post("/logout", authenticate, function (req, res, next) {
	res.send("respond with a resource"); //todo
});

router.delete("/me", authenticate, function (req, res, next) {
	res.send("respond with a resource"); //todo
});

module.exports = router;
