const { Router } = require("express");
const upload = require("../middlewares/multer.middleware.js");
const {
  addDoctor,
  registerAdminAccount,
} = require("../controller/admin.controller.js");

// admin router

const adminRouter = Router();

// add doctor endpoint
adminRouter
  .route("/add-doctor")
  .post(upload.single("profile_image"), addDoctor);

// admin register endpoint
adminRouter.route("/register-admin").post(registerAdminAccount);

module.exports = adminRouter;
