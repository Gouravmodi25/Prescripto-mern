const ApiResponse = require("../utils/ApiResponse.js");
const UserModel = require("../models/user.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const validator = require("validator");
const ApiError = require("../utils/ApiError.js");
const sendEmail = require("../utils/sendMail.js");
const crypto = require("crypto");
const uploadOnCLoudinary = require("../utils/uploadOnCLoudinary.js");

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

  console.log(existedUser);

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
  console.log(accessToken);

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

  const resetPasswordUrl = `http:localhost:5173/reset-password/${resetPasswordToken}`;

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

  console.log(resetPasswordToken);

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

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
  userForgotPassword,
  userResetPassword,
  userChangePassword,
  updateUserDetails,
  getLoggedUserDetails,
};
