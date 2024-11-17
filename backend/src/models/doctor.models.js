const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profile_image: {
      type: String,
      required: true,
    },
    speciality: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    degree: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    availability: {
      type: Boolean,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    slot_booked: {
      type: Object,
      default: {},
    },
  },
  { minimize: false, timestamps: true }
);

const DoctorModel = mongoose.model("Doctors", doctorSchema);

module.exports = DoctorModel;
