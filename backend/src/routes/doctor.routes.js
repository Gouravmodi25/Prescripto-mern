const express = require("express");
const { Router } = express;
const { getAllDoctors } = require("../controller/doctor.controller.js");

const doctorRouter = Router();

// get all doctor
doctorRouter.route("/all-doctor-list").get(getAllDoctors);

module.exports = doctorRouter;
