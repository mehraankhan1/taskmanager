const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createLostItem,
  getLostItems,
  updateLostItem,
  deleteLostItem,
} = require("../controllers/lostItemController");
const multer = require("multer");
const path = require("path");

// Multer storage config (same as above)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", protect, upload.single("photo"), createLostItem);
router.get("/", getLostItems);
router.put("/:id", protect, upload.single("photo"), updateLostItem);
router.delete("/:id", protect, deleteLostItem);

module.exports = router;
