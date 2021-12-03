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
      trim: true,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: { phoneNumber: { $type: "string" } },
      },
    },
    email: {
      type: String,
      required: false,
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
    location: {
      city: {
        type: String,
        required: true,
      },
      district: {
        type: String,
        required: true,
      },
      ward: {
        type: String,
        required: true,
      },
      village: {
        type: String,
        required: false,
      },
    },
    religion: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

CitizenSchema.index({
  "location.city": 1,
  "location.district": 1,
  "location.ward": 1,
});

module.exports = mongoose.model("Citizen", CitizenSchema);
