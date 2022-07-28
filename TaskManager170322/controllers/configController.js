const Config = require("../models/config");

// Defining methods for the bookController
module.exports = {
  find: function (req, res) {
    Config.find(req.body)
      .then((response) => res.json(response))
      .catch((err) => res.status(422).json(err));
  },

  create: function (req, res) {
    Config.create(req.body)
      .then((response) => res.json(response))
      .catch((err) => res.status(422).json(err));
  },
  update: function (req, res) {
    //console.log(req.body.info);
    Config.findOneAndUpdate({ _id: req.body.id }, req.body.info)
      .then((dbUser) => res.json(dbUser))
      .catch((err) => res.status(422).json(err));
  },
};
