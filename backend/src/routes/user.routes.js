const { Router } = require("express");

const userRouter = Router();

const { registerUser, userLogin } = require("../controller/user.controller.js");

// register user route
userRouter.route("/user-register").post(registerUser);

// user login route
userRouter.route("/user-login").post(userLogin);

module.exports = userRouter;
