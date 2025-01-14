const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const DoctorModel = require("../models/doctor.models.js");
const validator = require("validator");
const ApiError = require("../utils/ApiError.js");
const sendEmail = require("../utils/sendMail.js");
const crypto = require("crypto");
const AppointmentModel = require("../models/appointment.models.js");
const razorpayInstance = require("../utils/razorpay.js");

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
    new ApiResponse(200, "Doctor Logged In SuccessFully", {
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

  console.log(resetToken);

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

// reset password api for doctor

const resetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (
    [newPassword, confirmPassword].some(
      (item) => String(item || "").trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are required"));
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "Password must be at least 8 characters long")
      );
  }

  if (newPassword !== confirmPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Both passwords should be the same"));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  console.log("Reset token received:", req.params.resetToken);
  console.log("Hashed reset token:", resetPasswordToken);

  const doctor = await DoctorModel.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  console.log("Doctor found in database:", doctor);

  if (!doctor) {
    return res.status(400).json(new ApiResponse(400, "Invalid Reset Token"));
  }

  doctor.password = newPassword;
  doctor.resetPasswordToken = undefined;
  doctor.resetPasswordTokenExpiry = undefined;

  await doctor.save({ validateBeforeSave: false });

  const newDoctor = await DoctorModel.findOne({ _id: doctor._id }).select(
    "-password"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully", newDoctor));
});

// logout handler

const logoutDoctor = asyncHandler(async (req, res) => {
  const doctor = await DoctorModel.findByIdAndUpdate(
    req.doctor._id,
    {
      $unset: {
        accessToken: 1,
      },
    },
    {
      new: true,
    }
  ).select("-password");
  const options = {
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "Doctor Logged out", doctor));
});

// change password api
const changePasswordDoctor = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const doctor = await DoctorModel.findById(req.doctor._id).select("+password");

  const isDoctorPasswordCorrect = await doctor.isCorrectPassword(oldPassword);

  if (!isDoctorPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Old Password is incorrect"));
  }

  const isSamePassword = await doctor.isSamePassword(newPassword);

  if (isSamePassword) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "New Password should not same as old Password")
      );
  }

  doctor.password = newPassword;
  await doctor.save({ validateBeforeSave: false });

  const newDoctor = await DoctorModel.findById(req.doctor._id).select(
    "-password"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully", newDoctor));
});

// get list of appointment

const toGetListOfAppointment = asyncHandler(async (req, res) => {
  const doctorId = req.doctor._id;

  console.log(doctorId);

  const appointmentData = await AppointmentModel.find({ doctorId });

  if (!appointmentData) {
    return res.status(400).json(400, "Failed to fetch Appointment Data");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Successfully fetched Data", appointmentData));
});

// api to mark appointment complete by doctor

const markAppointmentComplete = asyncHandler(async (req, res) => {
  const { appointmentId } = req.body;

  const doctorId = req.doctor._id;

  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    return res.status(400).json(new ApiResponse(400, "Appointment not found"));
  }

  if (appointment && appointment.doctorId == doctorId) {
    await AppointmentModel.findByIdAndUpdate(appointmentId, {
      isComplete: true,
    });

    const newAppointmentData = await AppointmentModel.findById(appointment._id);

    return res
      .status(200)
      .json(new ApiResponse(200, "Appointment Marked"), newAppointmentData);
  } else {
    return res.status(400).json(new ApiResponse(400, "Failed to marked"));
  }
});

// api to cancel appointment by doctor

const cancelledAppointmentForDoctor = asyncHandler(async function (req, res) {
  const { appointmentId } = req.body;
  const doctorId = req.doctor._id;

  if (!appointmentId) {
    return res.status(400).json(new ApiResponse(400, "Invalid appointment ID"));
  }

  const appointment = await AppointmentModel.findById(appointmentId);

  if (!appointment) {
    return res.status(400).json(new ApiResponse(400, "Appointment not found"));
  }

  if (appointment.doctorId.toString() !== doctorId.toString()) {
    return res.status(403).json(new ApiResponse(403, "Unauthorized access"));
  }

  const { slotDate, slotTime } = appointment;

  const doctorData = await DoctorModel.findById(doctorId);

  let slotBooked = doctorData.slot_booked;

  if (slotBooked[slotDate]) {
    slotBooked[slotDate] = slotBooked[slotDate].filter(
      (item) => item !== slotTime
    );
  } else {
    return res
      .status(400)
      .json(new ApiResponse(400, "Slot date not found in booked slots"));
  }

  await DoctorModel.findByIdAndUpdate(doctorId, { slot_booked: slotBooked });

  // Refund logic
  let refundResponse = null;

  if (appointment.payment && appointment.paymentId) {
    try {
      const refund = await razorpayInstance.payments.refund(
        appointment.paymentId,
        { amount: appointment.amount * 100 }
      );
      refundResponse = refund;
    } catch (error) {
      console.error("Refund Error:", error.message);
    }
  }

  const updatedAppointmentData = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    {
      cancelled: true,
      refundInitiated: !!refundResponse,
      refundDetails: refundResponse,
    },
    { new: true }
  );

  if (!updatedAppointmentData) {
    return res
      .status(500)
      .json(new ApiResponse(500, "Failed to update appointment data"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        refundResponse
          ? "Appointment cancelled and refund initiated"
          : "Appointment cancelled successfully",
        updatedAppointmentData
      )
    );
});

module.exports = {
  changeAvailability,
  getAllDoctors,
  toGetBookedSlot,
  loginDoctor,
  forgotPassword,
  resetPassword,
  logoutDoctor,
  changePasswordDoctor,
  toGetListOfAppointment,
  markAppointmentComplete,
  cancelledAppointmentForDoctor,
};
