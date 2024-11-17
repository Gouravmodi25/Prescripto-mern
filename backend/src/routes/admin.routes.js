const { Router } = require("express");
const upload = require("../middlewares/multer.middleware.js");
const { addDoctor } = require("../controller/admin.controller.js");

// admin router

const adminRouter = Router();

adminRouter
  .route("/add-doctor")
  .post(upload.single("profile_image"), addDoctor);

module.exports = adminRouter;
