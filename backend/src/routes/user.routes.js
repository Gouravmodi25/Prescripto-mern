const { Router } = require("express");
const userAuthentication = require("../middlewares/userAuth.middleware.js");
const userRouter = Router();

const {
  registerUser,
  userLogin,
  logoutUser,
  userForgotPassword,
  userResetPassword,
} = require("../controller/user.controller.js");

// register user route
userRouter.route("/user-register").post(registerUser);

// user login route
userRouter.route("/user-login").post(userLogin);

// user logout route

userRouter.route("/user-logout").post(userAuthentication, logoutUser);

// user forgot password

userRouter.route("/user-forgot-password").post(userForgotPassword);

// user reset password api

userRouter
  .route("/user-reset-password/:resetPasswordToken")
  .patch(userResetPassword);

module.exports = userRouter;
