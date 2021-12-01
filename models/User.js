const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 60,
    },
    regency: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
    },
    startTime: {
      type: Date
    },
    endTime: {
      type: Date
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
