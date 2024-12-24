const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler.js");
const ApiError = require("../utils/ApiError.js");
const AdminModel = require("../models/admin.models.js");

const adminAuthentication = asyncHandler(async function (req, _, next) {
  try {
    const token = req.header("Authorization") || req.cookies?.accessToken;

    if (!token) {
      throw new ApiError("401", "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const loggedInAdmin = await AdminModel.findById(decodedToken._id).select(
      "-password"
    );

    if (!loggedInAdmin) {
      throw new ApiError(401, "Invalid access token");
    }

    req.admin = loggedInAdmin;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

module.exports = adminAuthentication;
