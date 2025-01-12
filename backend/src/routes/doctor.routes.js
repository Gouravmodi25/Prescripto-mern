const express = require("express");
const { Router } = express;
const {
  getAllDoctors,
  toGetBookedSlot,
} = require("../controller/doctor.controller.js");

const doctorRouter = Router();

// get all doctor

doctorRouter.route("/all-doctor-list").get(getAllDoctors);

//to get booked slots with help of doctorId and date query

doctorRouter.route("/get-booked-slot").get(toGetBookedSlot);

module.exports = doctorRouter;
