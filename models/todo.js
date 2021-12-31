const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema(
	{
		completed: { type: Boolean, default: false },
		description: { type: String, required: [true, "Description is required"] },
		owner: mongoose.Schema.Types.ObjectId,
	},
	{
		timestamps: true,
	}
);

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
