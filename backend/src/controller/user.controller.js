const ApiResponse = require("../utils/ApiResponse.js");
const UserModel = require("../models/user.models.js");
const asyncHandler = require("../utils/asyncHandler.js");
const validator = require("validator");
const ApiError = require("../utils/ApiError.js");

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

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
};
