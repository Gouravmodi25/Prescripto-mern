const express = require("express");
const { Router } = express;
const {
  getAllDoctors,
  toGetBookedSlot,
  loginDoctor,
  forgotPassword,
} = require("../controller/doctor.controller.js");

const doctorRouter = Router();

// get all doctor

doctorRouter.route("/all-doctor-list").get(getAllDoctors);

//to get booked slots with help of doctorId and date query

doctorRouter.route("/get-booked-slot").get(toGetBookedSlot);

// login route

doctorRouter.route("/login").post(loginDoctor);

// forgot password route

doctorRouter.route("/forgot-password").post(forgotPassword);

module.exports = doctorRouter;
