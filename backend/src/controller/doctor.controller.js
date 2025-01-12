const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const DoctorModel = require("../models/doctor.models.js");

const changeAvailability = asyncHandler(async function (req, res) {
  const { doctorId, status } = req.body;

  if (!doctorId && !status) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please Enter Doctor Id and Status"));
  }

  const doctor = await DoctorModel.findById(doctorId);

  if (!doctor) {
    return res.status(400).json(new ApiResponse(400, "Doctor Not Found"));
  }

  if (!["Available", "Unavailable", "On Leave"].includes(status)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please Enter valid status"));
  }

  const updatedDoctor = await DoctorModel.findByIdAndUpdate(
    doctorId,
    {
      availability: status,
    },
    { new: true }
  ).select("-password");

  if (!updatedDoctor) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error while changing doctor availability"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Successfully Changed availability", updatedDoctor)
    );
});

// to get all doctors

const getAllDoctors = asyncHandler(async function (req, res) {
  try {
    const doctor = await DoctorModel.find({}).select(["-password", "-email"]);

    return res
      .status(200)
      .json(new ApiResponse(200, "Successfully Get All Doctor", doctor));
  } catch (error) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error While Retrieving Doctor"));
  }
});

// get booked slot of doctor

const toGetBookedSlot = asyncHandler(async function (req, res) {
  const { doctorId, date } = req.query; // Expecting doctorId and optional date as query parameters

  // Validate input
  if (!doctorId) {
    return res.status(400).json(new ApiResponse(400, "Doctor ID is required"));
  }

  // Fetch doctor data
  const doctorData = await DoctorModel.findById(doctorId).select("slot_booked");
  if (!doctorData) {
    return res.status(404).json(new ApiResponse(404, "Doctor not found"));
  }

  const bookedSlots = doctorData.slot_booked || {};

  // If a specific date is requested, filter by that date
  if (date) {
    return res.status(200).json(
      new ApiResponse(200, "Booked Slots for the given date", {
        date,
        slots: bookedSlots[date] || [],
      })
    );
  }

  // Return all booked slots if no specific date is provided
  return res
    .status(200)
    .json(new ApiResponse(200, "All Booked Slots", bookedSlots));
});

module.exports = {
  changeAvailability,
  getAllDoctors,
  toGetBookedSlot,
};
