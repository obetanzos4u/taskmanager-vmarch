const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: { type: String },
  sapNumber: { type: Number },
  task: { type: String },
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
