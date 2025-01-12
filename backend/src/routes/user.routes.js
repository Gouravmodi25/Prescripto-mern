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
  getLoggedUserDetails,
  toBookedAppointment,
  toGetListOfAppointment,
  toCancelledAppointment,
  paymentRazorpay,
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

// fetched User Details

userRouter.route("/get-details").get(userAuthentication, getLoggedUserDetails);

// to book appointment

userRouter
  .route("/booked-appointment")
  .post(userAuthentication, toBookedAppointment);

// get list of appointment

userRouter
  .route("/list-of-appointment")
  .get(userAuthentication, toGetListOfAppointment);

// cancelled Appointment

userRouter
  .route("/to-cancel-appointment")
  .patch(userAuthentication, toCancelledAppointment);

// make razorpay payment
userRouter.route("/payment").post(userAuthentication, paymentRazorpay);

module.exports = userRouter;
