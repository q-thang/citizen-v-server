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
    currentAddress: {
      type: String,
      required: true,
    },
    residentAddress: {
      type: String,
      required: true,
    },
    educationLevel: {
      type: String,
      required: true,
    },
    identifiedCode: {
      type: String,
      required: function () {
        const age =
          new Date().getFullYear() - parseInt(this.dateOfBirth.slice(-4));

        if (age < 15) {
          return false;
        }
        return true;
      },
      length: 12,
      trim: true,
      index: {
        unique: true,
        sparse: true,
        partialFilterExpression: { identifiedCode: { $type: "string" } },
      },
    },
    occupation: {
      type: String,
      required: true,
    },
    ethnic: {
      type: String,
      required: true,
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
      required: true,
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
