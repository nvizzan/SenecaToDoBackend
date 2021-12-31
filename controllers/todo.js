const Todo = require("../models/todo");
var mongoose = require("mongoose");

exports.getTodoList = async (req, res, next) => {
	try {
		const tasks = await Todo.find();
		res.status(200).json({
			success: true,
			data: tasks,
		});
	} catch (err) {
		let message = err;

		return res.status(401).json({
			status: "error",
			error: {
				message,
			},
		});
	}
};

exports.getTodo = async (req, res, next) => {
	let _id = req.params.id;

	if (!_id) {
		return res.status(401).json({
			status: "error",
			error: "Invalid Task ID",
		});
	}

	try {
		const task = await Todo.findById({
			_id: _id,
		});

		if (task === null) {
			return res.status(200).json({});
		}

		return res.status(200).json({
			status: true,
			data: task,
		});
	} catch (err) {
		let message = err;

		return res.status(401).json({
			status: "error",
			error: "Invalid Task ID",
		});
	}
};

exports.addTask = async (req, res, next) => {
	try {
		let data = { ...req.body };

		if (
			data &&
			Object.keys(data).length === 0 &&
			Object.getPrototypeOf(data) === Object.prototype
		) {
			return res.status(401).json({
				status: "error here",
				error: "Can't create an empty todo",
			});
		}

		data.owner = req.user._id;
		let todo = await Todo.create(data);

		res.status(200).json({
			success: true,
			data: todo,
		});
	} catch (err) {
		let message = err;

		return res.status(401).json({
			status: "error",
			error: {
				message,
			},
		});
	}
};

exports.updateTask = async (req, res, next) => {
	let _id = req.params.id;
	let data = { ...req.body };

	console.log(data);

	if (
		data &&
		Object.keys(data).length === 0 &&
		Object.getPrototypeOf(data) === Object.prototype
	) {
		return res.status(401).json({
			status: "error here",
			error: "Can't update task with empty object",
		});
	}

	if (!_id) {
		return res.status(401).json({
			status: "error",
			error: "Invalid Task ID",
		});
	}

	try {
		const task = await Todo.findByIdAndUpdate({ _id: _id }, data, {
			new: true,
		});

		if (task === null) {
			return res.status(401).json({
				status: "error",
				error: "Invalid Task ID",
			});
		}

		res.status(200).json({
			status: true,
			data: task,
		});
	} catch (err) {
		let message = err;

		return res.status(401).json({
			status: "error",
			error: "Invalid Task ID",
		});
	}
};

exports.deleteTask = async (req, res, next) => {
	let _id = req.params.id;

	if (!_id) {
		return res.status(401).json({
			status: "error",
			error: "Invalid Task ID",
		});
	}

	try {
		const task = await Todo.findById({ _id: _id });

		if (!task) {
			throw new Error("Invalid Task ID");
		}

		try {
			const task = await Todo.findOneAndDelete({ _id: _id });

			res.status(200).json({
				status: true,
			});
		} catch (err) {
			let message = err;

			return res.status(401).json({
				status: "error",
				error: "Invalid Task ID",
			});
		}
	} catch (err) {
		let message = err;

		return res.status(401).json({
			status: "error",
			error: "Invalid Task ID",
		});
	}
};
