const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  doctorId: {
    type: String,
    required: true,
  },
  slotDate: {
    type: String,
    required: true,
  },
  slotTime: {
    type: String,
    required: true,
  },
  userData: {
    type: Object,
    required: true,
  },
  doctorData: {
    type: Object,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  cancelled: {
    type: Boolean,
    default: false,
  },
  payment: {
    type: Boolean,
    default: false,
  },
  isComplete: {
    type: Boolean,
    default: false,
  },
  payment: { type: Boolean, default: false },
  paymentId: { type: String }, // Store Razorpay payment ID
  refundInitiated: { type: Boolean, default: false },
  refundDetails: { type: Object, default: null },
});

const AppointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = AppointmentModel;
