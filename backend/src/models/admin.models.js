const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const adminSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
  },
  accessToken: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordTokenExpiry: {
    type: Date,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

adminSchema.methods.isCorrectPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.methods.isSamePassword = async function (newPassword) {
  return await bcrypt.compare(newPassword, this.password);
};

adminSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "3d",
    }
  );
};

adminSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordTokenExpiry = Date.now() + 10 * (60 * 1000);
  return resetToken;
};

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
