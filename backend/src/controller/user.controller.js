const ApiResponse = require("../utils/ApiResponse.js");
const UserModel = require("../models/user.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const validator = require("validator");
const ApiError = require("../utils/ApiError.js");
const sendEmail = require("../utils/sendMail.js");
const crypto = require("crypto");
const uploadOnCLoudinary = require("../utils/uploadOnCLoudinary.js");
const DoctorModel = require("../models/doctor.models.js");
const AppointmentModel = require("../models/appointment.models.js");
const razorpayInstance = require("../utils/razorpay.js");

// for generate Token
const generateToken = async function (userId) {
  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      throw new ApiError(400, "User Not Found");
    }

    const accessToken = user.generateAccessToken();
    user.accessToken = accessToken;
    await user.save({ validateBeforeSave: false });
    return accessToken;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new ApiError(500, "Something Went Wrong While Generating Token");
  }
};

// user register controller
const registerUser = asyncHandler(async function (req, res) {
  const { fullName, email, password } = req.body;

  if (
    [fullName, email, password].some(
      (item) => String(item || "")?.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All Fields are required"));
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please enter valid email"));
  }

  const existedUser = await UserModel.findOne({ email });

  if (existedUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, "User is already registered Please Login "));
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Password should be strong "));
  }

  const createdUser = await UserModel.create({
    fullName,
    email,
    password,
  });

  const accessToken = await generateToken(createdUser._id);

  const options = {
    secure: true,
  };

  const user = await UserModel.findById(createdUser._id).select("-password");

  user.accessToken = accessToken;

  await user.save({ validateBeforeSave: false });

  if (!createdUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error While Registering User"));
  }

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(201, "User Registered SuccessFully", user));
});

// user login controller

const userLogin = asyncHandler(async function (req, res) {
  const { email, password } = req.body;

  if ([email, password].some((item) => String(item || "").trim() === "")) {
    return res.status(400).json(new ApiResponse(400, "All Field are Required"));
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Please Enter Valid Email"));
  }

  const user = await UserModel.findOne({ $or: [{ email }] });

  if (!user) {
    return res.status(400).json(new ApiResponse(400, "Invalid Credentials"));
  }

  const isCorrectPassword = await user.isCorrectPassword(password);

  if (!isCorrectPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Entered Password is incorrect"));
  }

  const accessToken = await generateToken(user._id);

  const options = {
    secure: true,
  };

  const loggedUser = await UserModel.findById(user._id).select("-password");

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, "User Logged In Successfully", loggedUser));
});

// user logout controller

const logoutUser = asyncHandler(async function (req, res) {
  const { user } = req;

  const loggedInUser = await UserModel.findByIdAndUpdate(
    user._id,
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
    .json(new ApiResponse(200, "User Logged Out", loggedInUser));
});

// user forgot password api

const userForgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (String(email || "").trim() === "") {
    return res.status(400).json(new ApiResponse(400, "Email is required"));
  }

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Email is Valid Please Enter valid Email"));
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(400).json(new ApiResponse(404, "Invalid Email"));
  }

  const resetPasswordToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `https://prescrpito-gourav.netlify.app/reset-password/${resetPasswordToken}`;

  const message = `
      <h1>This message is from Prescripto Project</h1>
      <h3>You have requested to reset your password</h3>
      <p>Please go to this link to reset your password</p>
      <a href=${resetPasswordUrl} clicktracking=off>${resetPasswordUrl}</a>
    `;

  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: message,
    });

    const newUser = await UserModel.findById(user._id).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, "Email sent successfully", newUser));
  } catch (error) {
    admin.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save({ validationBeforeSave: false });

    return res
      .status(500)
      .json(new ApiResponse(500, "Email could not be sent"));
  }
});

// user reset Password api

const userResetPassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  if (
    [newPassword, confirmPassword].some(
      (field) => String(field || "").trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All fields are Required"));
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
      .json(new ApiResponse(400, "Both Password should be same"));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resetPasswordToken)
    .digest("hex");

  const user = await UserModel.findOne({
    resetPasswordToken,
    resetPasswordTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json(new ApiResponse(400, "Invalid Reset Token"));
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  const newUser = await UserModel.findById(user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Reset Successfully", newUser));
});

// user change password api

const userChangePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await UserModel.findById(req.user._id);

  const isUserCorrectPassword = await user.isCorrectPassword(oldPassword);

  if (!isUserCorrectPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Old Password is incorrect"));
  }

  const isSamePassword = await user.isSamePassword(newPassword);

  if (isSamePassword) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "New Password should not same as old Password")
      );
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  const newUser = await UserModel.findById(user._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully", newUser));
});

// update user details

const updateUserDetails = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { fullName, address, gender, date_of_birth, phone } = req.body;

  // Validate input using a single object for better readability
  const validationErrors = [];

  if (!fullName) validationErrors.push("FullName is required");
  if (!address) validationErrors.push("Address is required");
  if (!gender) validationErrors.push("Gender is required");
  if (!date_of_birth) validationErrors.push("Date of Birth is required");
  if (!phone) validationErrors.push("Phone is required");
  if (!["Male", "Female", "Not selected"].includes(gender)) {
    validationErrors.push("Invalid gender");
  }
  if (
    !validator.isDate(date_of_birth, { format: "YYYY-MM-DD", strictMode: true })
  ) {
    validationErrors.push("Invalid Date of Birth");
  }
  if (!validator.isMobilePhone(phone, "en-IN", { strictMode: true })) {
    validationErrors.push("Invalid Phone number");
  }

  if (validationErrors.length > 0) {
    return res
      .status(400)
      .json(new ApiResponse(400, validationErrors.join(", ")));
  }

  const existingUser = await UserModel.findById(userId);
  if (!existingUser) {
    return res.status(400).json(new ApiResponse(400, "User not found"));
  }

  // Handle profile image logic more concisely
  let profileImageUrl = existingUser.profile_image;
  let profileImageLocalPath = req?.file?.path;

  if (profileImageLocalPath) {
    try {
      const cloudinaryResponse = await uploadOnCLoudinary(
        profileImageLocalPath
      );
      if (cloudinaryResponse) {
        profileImageUrl = cloudinaryResponse.url;
      } else {
        return res
          .status(400)
          .json(
            new ApiResponse(400, "Error While uploading image to Cloudinary")
          );
      }
    } catch (error) {
      return res.status(400).json(new ApiResponse(400, error.message));
    }
  } else if (!profileImageUrl) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Profile Image is required"));
  }

  // Update user details in a single operation
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      fullName,
      address: JSON.parse(address),
      phone,
      gender,
      date_of_birth,
      profile_image: profileImageUrl,
    },
    { new: true, runValidators: true } // Ensure validation rules are applied during update
  ).select("-password");

  if (!updatedUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error While Updating Profile"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile Updated Successfully", updatedUser));
});
// get logged user details

const getLoggedUserDetails = asyncHandler(async function (req, res) {
  const userId = req.user._id;

  const user = await UserModel.findById(userId).select([
    "-password",
    "-accessToken",
  ]);

  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error While Finding User"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "SuccessFully Fetched User Details", user));
});

// api to booked appointment by user

const toBookedAppointment = asyncHandler(async function (req, res) {
  const userId = req.user._id;

  const { doctorId, slotDate, slotTime } = req.body;

  if (
    [doctorId, slotDate, slotTime].some(
      (item) => String(item || "").trim() === ""
    )
  ) {
    return res.status(400).json(new ApiResponse(400, "All Field are Required"));
  }

  const doctorData = await DoctorModel.findById(doctorId).select("-password");

  if (
    doctorData.availability == "Unavailable" ||
    doctorData.availability == "On Leave"
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Currently Doctor is not Available"));
  }

  const slot_booked = doctorData.slot_booked || {};
  if (!slot_booked[slotDate]) {
    slot_booked[slotDate] = [];
  }

  if (slot_booked[slotDate].includes(slotTime)) {
    return res.status(400).json(new ApiResponse(400, "Slot is not Available"));
  }

  slot_booked[slotDate].push(slotTime);

  const userData = await UserModel.findById(userId).select(["-password"]);

  if (!userData) {
    return res.status(404).json(new ApiResponse(404, "User not found"));
  }

  // delete doctorData.slot_booked;

  const appointmentData = {
    userId,
    doctorId,
    userData,
    doctorData: {
      ...doctorData.toObject(), // Convert Mongoose document to plain object
      slot_booked: undefined, // Exclude `slot_booked` from doctor data
    },
    slotTime,
    slotDate,
    date: Date.now(),
    amount: doctorData.fees,
  };

  const newAppointment = await AppointmentModel.create(appointmentData);

  // save new slot data in doctor data
  await DoctorModel.findByIdAndUpdate(doctorId, { slot_booked });

  return res
    .status(200)
    .json(new ApiResponse(200, "Appointment Booked", newAppointment));
});

// to get list of appointment of user

const toGetListOfAppointment = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate that userId exists
    if (!userId) {
      return res
        .status(400)
        .json(new ApiResponse(400, "User ID is required", null));
    }

    // Fetch appointments for the user
    const userList = await AppointmentModel.find({ userId });

    // Return success response with the list of appointments
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Successfully retrieved list of appointments",
          userList
        )
      );
  } catch (error) {
    console.error("Error retrieving list of appointments:", error.message);

    // Return error response
    return res
      .status(500)
      .json(
        new ApiResponse(500, "Failed to retrieve list of appointments", null)
      );
  }
});

const toCancelledAppointment = asyncHandler(async function (req, res) {
  const { appointmentId } = req.body;

  const userId = req.user._id;

  const appointmentData = await AppointmentModel.findById(appointmentId);

  if (appointmentData.userId !== userId.toString()) {
    return res.status(400).json(new ApiResponse(400, "Unauthorized Action"));
  }

  await AppointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

  // releasing doctor slot

  const { doctorId, slotDate, slotTime } = appointmentData;

  const doctorData = await DoctorModel.findById(doctorId);

  let slotBooked = doctorData.slot_booked;

  slotBooked[slotDate] = slotBooked[slotDate].filter(
    (item) => item != slotTime
  );

  await DoctorModel.findByIdAndUpdate(doctorId, { slot_booked: slotBooked });

  // refund logic

  let refundResponse = null;

  if (appointmentData.payment) {
    try {
      const refund = await razorpayInstance.payments.refund(
        appointmentData.paymentId,
        {
          amount: appointmentData.amount * 100, // Refund full amount
        }
      );
      refundResponse = refund;
    } catch (error) {
      console.error("Refund Error:", error.message);
      return res
        .status(500)
        .json(new ApiResponse(500, "Error initiating refund", error.message));
    }
  }

  const updatedAppointmentData = await AppointmentModel.findByIdAndUpdate(
    appointmentId,
    {
      refundInitiated: !!refundResponse,
      refundDetails: refundResponse,
    },
    { new: true }
  );

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

// api to make payment of appointment using razorpay

const paymentRazorpay = asyncHandler(async function (req, res) {
  const { appointmentId } = req.body;

  const appointmentData = await AppointmentModel.findById(appointmentId);

  if (!appointmentData || appointmentData.cancelled) {
    return res.status(400).json(new ApiResponse(400, "Appointment Cancelled"));
  }

  const options = {
    amount: appointmentData.amount * 100,
    currency: process.env.CURRENCY,
    receipt: appointmentId,
  };

  // creation of order

  const order = await razorpayInstance.orders.create(options);

  return res
    .status(200)
    .json(new ApiResponse(200, "Make Payment SuccessFully", order));
});

// api to verify payment

const verifyPayment = asyncHandler(async function (req, res) {
  const { razorpay_order_id, razorpay_payment_id } = req.body;

  const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

  if (orderInfo.status === "paid") {
    await AppointmentModel.findByIdAndUpdate(orderInfo.receipt, {
      payment: true,
      paymentId: razorpay_payment_id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Payment SuccessFully ", orderInfo));
  } else {
    return res
      .status(200)
      .json(new ApiResponse(200, "Payment Failed ", orderInfo));
  }
});

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
  userForgotPassword,
  userResetPassword,
  userChangePassword,
  updateUserDetails,
  getLoggedUserDetails,
  toBookedAppointment,
  toGetListOfAppointment,
  toCancelledAppointment,
  paymentRazorpay,
  verifyPayment,
};
