const { Router } = require("express");
const userAuthentication = require("../middlewares/userAuth.middleware.js");
const userRouter = Router();

const {
  registerUser,
  userLogin,
  logoutUser,
  userForgotPassword,
  userResetPassword,
  userChangePassword,
  updateUserDetails,
} = require("../controller/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");

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

//user change password route

userRouter
  .route("/user-change-password")
  .patch(userAuthentication, userChangePassword);

// update user details route

userRouter
  .route("/user-update-details")
  .patch(upload.single("profile_image"), userAuthentication, updateUserDetails);

module.exports = userRouter;
