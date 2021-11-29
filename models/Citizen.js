const mongoose = require("mongoose");

const CitizenSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    currentAddress: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
    },
    identifiedCode: {
      type: String,
      required: true,
      length: 12,
      unique: true,
    },
    occupation: {
      type: String,
      required: false,
      default: null,
    },
    ethnic: {
      type: String,
      required: false,
    },
    religion: {
      type: String,
      required: true,
    },
    idUnit: {
      type: mongoose.Types.ObjectId,
      ref: "Unit",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Citizen", CitizenSchema);
