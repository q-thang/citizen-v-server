const mongoose = require("mongoose");

const UnitSchema = new mongoose.Schema(
  {
    nameOfUnit: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    idParent: {
      type: mongoose.Types.ObjectId,
      ref: "Unit",
    },
    status: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Unit", UnitSchema);
