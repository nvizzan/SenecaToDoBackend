var express = require("express");
var router = express.Router();
const passport = require("passport");
const { authenticate } = require("../middlewares/auth");
const TodoController = require("../controllers/todo");

/* Get task list */
router.get("/task", authenticate, TodoController.getTodoList);

router.get("/task/:id", authenticate, TodoController.getTodo);

router.post("/task", authenticate, TodoController.addTask);

router.put("/task/:id", authenticate, TodoController.updateTask);

router.delete("/task/:id", authenticate, TodoController.deleteTask);

module.exports = router;
