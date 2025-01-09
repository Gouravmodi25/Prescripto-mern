const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.models");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse.js");
const ApiError = require("../utils/ApiError.js");

const userAuthentication = asyncHandler(async function (req, res, next) {
  const token = req.header("Authorization") || req.cookies?.accessToken;

  try {
    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, "Not Authorized Login Again"));
    }

    let decodedToken;

    try {
      decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      return res
        .status(401)
        .json(
          new ApiResponse(401, "Invalid or expired token. Please log in again.")
        );
    }

    let loggedUser;

    try {
      loggedUser = await UserModel.findById(decodedToken._id).select(
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

    req.user = loggedUser;
    next();
  } catch (error) {
    return res
      .status(401)
      .json(new ApiResponse(401, "Not Authorized Login Again"));
  }
});

module.exports = userAuthentication;
