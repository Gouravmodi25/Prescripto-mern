const express = require("express");
const { Router } = express;
const {
  getAllDoctors,
  toGetBookedSlot,
  loginDoctor,
  forgotPassword,
  resetPassword,
  logoutDoctor,
} = require("../controller/doctor.controller.js");

const doctorAuthentication = require("../middlewares/doctorAuthentication.js");

const doctorRouter = Router();

// get all doctor

doctorRouter.route("/all-doctor-list").get(getAllDoctors);

//to get booked slots with help of doctorId and date query

doctorRouter.route("/get-booked-slot").get(toGetBookedSlot);

// login route

doctorRouter.route("/login").post(loginDoctor);

// forgot password route

doctorRouter.route("/forgot-password").post(forgotPassword);

// reset password

doctorRouter.route("/reset-password/:resetToken").post(resetPassword);

// logout doctor

doctorRouter.route("/logout-doctor").post(doctorAuthentication, logoutDoctor);

module.exports = doctorRouter;
