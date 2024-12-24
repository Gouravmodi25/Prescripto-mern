const DoctorModel = require("../models/doctor.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const validator = require("validator");
const uploadOnCloudinary = require("../utils/uploadOnCLoudinary.js");
const AdminModel = require("../models/admin.models.js");

// generate access token for admin
const generateToken = async function (admin_id) {
  try {
    const admin = await AdminModel.findOne({ _id: admin_id });
    const accessToken = admin.generateToken();
    admin.accessToken = accessToken;
    await admin.save({ validationBeforeSave: false });
    return accessToken;
  } catch (error) {
    throw new ApiError(400, "Something went wrong while generating token");
  }
};

// controller for adding doctors
const addDoctor = asyncHandler(async (req, res) => {
  console.log(req.body);
  const {
    fullName,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    availability,
    fees,
    address,
  } = req.body;

  if (
    [
      fullName,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      availability,
      fees,
      address,
    ].some((items) => String(items || "")?.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, "All Fields are required"));
  }

  //   validate email is valid or not

  if (!validator.isEmail(email)) {
    return res
      .status(400)
      .ApiResponse(400, "Email is valid Please Provide valid Email");
  }

  //   check existed user

  const existedUser = await DoctorModel.findOne({
    $or: [{ email }],
  });

  console.log(existedUser);

  if (existedUser) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Doctor is already added"));
  }

  //   validate password

  if (password.length < 8) {
    return res
      .status(400)
      .json(new ApiResponse(400, "PLease enter Strong Password"));
  }

  const profile_imageLocalPath = req.file?.path;

  console.log("profile_imageLocalPath", profile_imageLocalPath);

  if (!profile_imageLocalPath) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Profile Image is required"));
  }

  const profile_Image = await uploadOnCloudinary(profile_imageLocalPath);

  console.log("profile Image CLoudinary", profile_Image);

  if (!profile_Image) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error While uploading image on CLoudinary"));
  }

  const doctor = await DoctorModel.create({
    fullName,
    email,
    password,
    profile_image: profile_Image.url,
    speciality,
    degree,
    experience,
    about,
    availability,
    fees,
    address: JSON.parse(address),
    date: Date.now(),
  });

  const createDoctor = await DoctorModel.findById(doctor._id).select(
    "-password"
  );

  if (!createDoctor) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error While adding Doctor"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Doctor added successfully", createDoctor));
});

// register admin endpoint
const registerAdminAccount = asyncHandler(async (req, res, next) => {
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
      .json(new ApiResponse(400, "Email is Valid Please Enter valid Email"));
  }

  const existedAdmin = await AdminModel.findOne({ $or: [{ email }] });

  if (existedAdmin) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Admin Already Registered"));
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Password should be strong "));
  }

  const admin = await AdminModel.create({
    fullName,
    email,
    password,
  });

  const createAdmin = await AdminModel.findById(admin._id).select("-password");

  if (!createAdmin) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Error while Registering Admin"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Admin Register successfully", createAdmin));
});

// login admin endpoint

const loginAdmin = asyncHandler(async function (req, res) {
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

  const admin = await AdminModel.findOne({ $or: [{ email }] });

  if (!admin) {
    return res.status(400).json(new ApiResponse(400, "Invalid Credentials"));
  }

  const isCorrectPassword = await admin.isCorrectPassword(password);

  if (!isCorrectPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Entered Password is incorrect"));
  }

  const accessToken = await generateToken(admin._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedAdmin = await AdminModel.findById(admin._id).select("-password");

  return res.status(200).cookie("accessToken", accessToken, options).json(
    new ApiResponse(200, "Admin Logged In SuccessFully", {
      loggedAdmin,
      accessToken,
    })
  );
});

const logoutAdmin = asyncHandler(async function (req, res) {
  const admin = await AdminModel.findByIdAndUpdate(
    req.admin._id,
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
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User Logged out", admin));
});

const changeAdminPassword = asyncHandler(async function (req, res) {
  const { oldPassword, newPassword } = req.body;

  const admin = await AdminModel.findById(req.admin._id).select("+password");

  const isAdminPasswordCorrect = await admin.isCorrectPassword(oldPassword);

  if (!isAdminPasswordCorrect) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Old Password is incorrect"));
  }

  const isSamePassword = await admin.isSamePassword(newPassword);

  if (isSamePassword) {
    return res
      .status(400)
      .json(
        new ApiResponse(400, "New Password should not same as old Password")
      );
  }

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  const newAdmin = await AdminModel.findById(req.admin._id).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, "Password Changed Successfully", newAdmin));
});

module.exports = {
  addDoctor,
  registerAdminAccount,
  loginAdmin,
  logoutAdmin,
  changeAdminPassword,
};
