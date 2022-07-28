const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  lastname: { type: String, required: true },
  isAdmin: { type: Boolean },
  site: { type: String },
  sapNumber: { type: Number },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
