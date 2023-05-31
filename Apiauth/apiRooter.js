var express = require("express");

var userController = require("./routes/UserController");

var apiRouter = express.Router();

apiRouter.route("/users/register/").post(userController.register);
apiRouter.route("/users/login/").post(userController.login);
apiRouter.route("/users/verif/:userId/:uniqueString/").get(userController.verif);
apiRouter.route("/users/reset/").post(userController.mdp);
apiRouter.route("/users/update/").post(userController.modif);
apiRouter.route("/users/one/:id").get(userController.oneuser);
apiRouter.route("/users/updateone/").post(userController.updateme);






module.exports = apiRouter;