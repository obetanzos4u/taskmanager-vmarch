const Task = require("../models/task");

// Defining methods for the bookController
module.exports = {
  findAll: function (req, res) {
    Task.find()
      .then((response) => res.json(response))
      .catch((err) => res.status(422).json(err));
  },
  create: function (req, res) {
    Task.create(req.body)
      .then((response) => res.json(response))
      .catch((err) => res.status(422).json(err));
  },
};
