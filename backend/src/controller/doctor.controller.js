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

module.exports = {
  changeAvailability,
};
