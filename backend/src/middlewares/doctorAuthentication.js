const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiResponse = require("../utils/ApiResponse.js");
const DoctorModel = require("../models/doctor.models.js");

const doctorAuthentication = asyncHandler(async function (req, res, next) {
  try {
    const token = req.header("Authorization") || req.cookies?.accessToken;

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Not Authorized Login Again"));
    }

    let decodedToken;
    try {
      // Verify token
      decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, "Invalid or expired token. Please log in again.")
        );
    }

    console.log(decodedToken._id);

    let loggedInDoctor;
    try {
      // Find admin by ID from the token
      loggedInDoctor = await DoctorModel.findById(decodedToken._id).select(
        "-password"
      );
    } catch (error) {
      return res
        .status(401)
        .json(
          new ApiResponse(
            401,
            "Error verifying token data. Please log in again."
          )
        );
    }
    if (!loggedInDoctor) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Not Authorized Login Again"));
    }

    req.doctor = loggedInDoctor;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Not Authorized Login Again"));
  }
});

module.exports = doctorAuthentication;
