const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String },
  photo: { type: String }, // URL to uploaded photo
  status: {
    type: String,
    enum: ["lost", "found", "resolved"],
    default: "lost",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LostItem", lostItemSchema);
