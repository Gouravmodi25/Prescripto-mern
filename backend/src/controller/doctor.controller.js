const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const DoctorModel = require("../models/doctor.models.js");
const validator = require("validator");
const ApiError = require("../utils/ApiError.js");
const sendEmail = require("../utils/sendMail.js");

// generate access token for admin
const generateToken = async function (doctor_id) {
  try {
    // Fetch the doctor
    const doctor = await DoctorModel.findOne({ _id: doctor_id });
    if (!doctor) {
      throw new ApiError(404, "Doctor not found");
    }

    // Generate the token
    const accessToken = doctor.generateToken();

    // Save the token to the database
    doctor.accessToken = accessToken;
    await doctor.save({ validateBeforeSave: false });

    return accessToken;
  } catch (error) {
    throw new ApiError(400, `Error while generating token: ${error.message}`);
  }
};

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

// login controller

const loginDoctor = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((item) => String(item || "").trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }
  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please Enter valid email"));
  }

  const doctor = await DoctorModel.findOne({ $or: [{ email }] });

  if (!doctor) {
    return res.status(400).json(new ApiResponse(400, "Invalid Credentials"));
  }

  const isCorrectPassword = await doctor.isCorrectPassword(password);

  if (!isCorrectPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Entered Password is incorrect"));
  }

  const accessToken = await generateToken(doctor._id);

  const options = {
    // Prevent JavaScript access
    secure: true, // Enable secure cookies in production
    maxAge: 24 * 60 * 60 * 1000,
  };

  const loggedDoctor = await DoctorModel.findById(doctor._id).select(
    "-password"
  );

  return res.status(200).cookie("accessToken", accessToken, options).json(
    new ApiResponse(200, "Admin Logged In SuccessFully", {
      loggedDoctor,
      accessToken,
    })
  );
});

// forgot password

const forgotPassword = asyncHandler(async function (req, res) {
  const { email } = req.body;

  if (email.trim() === "") {
    return res.status(400).json(new ApiResponse(400, "Email is required"));
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Email is Valid Please Enter valid Email"));
  }

  const doctor = await DoctorModel.findOne({ email });

  if (!doctor) {
    return res.status(400).json(new ApiResponse(400, "Invalid Email"));
  }

  const resetToken = doctor.getResetPasswordToken();

  await doctor.save({ validateBeforeSave: true });

  const resetUrl = `http://localhost:5175/reset-password/${resetToken}`;

  const message = `
      <h1>This message is from Prescripto Project</h1>
      <h3>You have requested to reset your password</h3>
      <p>Please go to this link to reset your password</p>
      <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
    `;
  try {
    await sendEmail({
      to: doctor.email,
      subject: "Password Reset Request",
      text: message,
    });

    const newDoctor = await DoctorModel.findOne(doctor._id).select("-password");

    console.log(newDoctor);

    return res
      .status(200)
      .json(new ApiResponse(200, "Email sent successfully", newDoctor));
  } catch (error) {
    doctor.resetPasswordToken = undefined;
    doctor.resetPasswordTokenExpiry = undefined;
    await doctor.save({ validationBeforeSave: false });

    return res
      .status(500)
      .json(new ApiResponse(500, "Email could not be sent"));
  }
});

module.exports = {
  changeAvailability,
  getAllDoctors,
  toGetBookedSlot,
  loginDoctor,
  forgotPassword,
};
