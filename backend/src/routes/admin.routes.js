const { Router } = require("express");
const upload = require("../middlewares/multer.middleware.js");
const {
  addDoctor,
  registerAdminAccount,
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
  forgotPassword,
  resetPassword,
  getAllDoctor,
  getAllAppointmentForAdmin,
  toCancelledAppointment,
  toGetAdminDashboard,
} = require("../controller/admin.controller.js");
const adminAuthentication = require("../middlewares/adminAuth.middleware.js");
const { changeAvailability } = require("../controller/doctor.controller.js");

// admin router

const adminRouter = Router();

// add doctor endpoint
adminRouter
  .route("/add-doctor")
  .post(adminAuthentication, upload.single("profile_image"), addDoctor);

// admin register endpoint
adminRouter.route("/register-admin").post(registerAdminAccount);

// admin Login endpoint
adminRouter.route("/admin-loggedIn").post(loginAdmin);

adminRouter.route("/admin-loggedOut").post(adminAuthentication, logoutAdmin);

adminRouter
  .route("/admin-changePassword")
  .post(adminAuthentication, changeAdminPassword);

adminRouter.route("/admin-forgotPassword").post(forgotPassword);

adminRouter.route("/resetPassword/:resetToken").post(resetPassword);

// retrieve all doctor
adminRouter.route("/all-doctors").post(adminAuthentication, getAllDoctor);

// change availability

adminRouter
  .route("/change-availability")
  .patch(adminAuthentication, changeAvailability);

// get all appointment

adminRouter
  .route("/get-all-appointments")
  .get(adminAuthentication, getAllAppointmentForAdmin);

// to cancelled appointment for admin

adminRouter
  .route("/cancelled-appointment")
  .post(adminAuthentication, toCancelledAppointment);

// to fetch dashboard data

adminRouter
  .route("/get-dashboard-data")
  .get(adminAuthentication, toGetAdminDashboard);

module.exports = adminRouter;
