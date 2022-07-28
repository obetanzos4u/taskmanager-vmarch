const router2 = require("express").Router();
const userController = require("../controllers/userController");
const configController = require("../controllers/configController");
const taskController = require("../controllers/taskController");

// Matches with "/api/books"
router2.route("/find").post(userController.find);
router2.route("/getAll").get(userController.findAll);
router2.route("/createUser").post(userController.create);
router2.route("/deleteUser").post(userController.delete);
router2.route("/updateUser").post(userController.update);
router2.route("/updatePassword").post(userController.update);

router2.route("/findSystem").post(configController.find);
router2.route("/createSystem").post(configController.create);
router2.route("/updateSystem").post(configController.update);

router2.route("/saveRecord").post(taskController.create);

// Matches with "/api/books/:id"

module.exports = router2;
