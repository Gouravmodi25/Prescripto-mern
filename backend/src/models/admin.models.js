const mongoose = require("express");

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
    trim: true,
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const adminModel = mongoose.model("Admin", adminSchema);

module.exports = adminModel;
