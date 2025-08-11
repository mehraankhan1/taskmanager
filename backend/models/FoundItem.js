const mongoose = require("mongoose");

const foundItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  photo: { type: String }, // URL to uploaded photo
  status: { type: String, enum: ["found", "claimed"], default: "found" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FoundItem", foundItemSchema);
