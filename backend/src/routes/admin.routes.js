const { Router } = require("express");
const upload = require("../middlewares/multer.middleware.js");
const {
  addDoctor,
  registerAdminAccount,
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
} = require("../controller/admin.controller.js");
const adminAuthentication = require("../middlewares/adminAuth.middleware.js");

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

module.exports = adminRouter;
