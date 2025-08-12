const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter the item title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    category: {
      type: String,
      enum: ["Electronics", "Clothing", "Documents", "Other"],
      default: "Other",
    },
    location: {
      type: String,
      required: [true, "Please enter the location"],
    },
    dateLost: {
      type: Date,
      default: Date.now,
    },
    photo: {
      type: String, // URL or file path of uploaded image
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Link to the user who created it
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LostItem", lostItemSchema);
