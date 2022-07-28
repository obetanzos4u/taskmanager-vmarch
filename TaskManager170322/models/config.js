const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const configSchema = new Schema({
  sapUrl: { type: String, required: true, unique: true },
  sapFunctionalUser: { type: String, required: true, unique: true },
  sapFunctionalPass: { type: String, required: true, unique: true },
  saptechnicallUser: { type: String, required: true, unique: true },
  saptechnicallPass: { type: String, required: true, unique: true },
});

const Config = mongoose.model("Config", configSchema);

module.exports = Config;
