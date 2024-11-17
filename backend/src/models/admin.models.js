const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

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
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const AdminModel = mongoose.model("Admin", adminSchema);

module.exports = AdminModel;
