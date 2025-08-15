const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
} = require("../controllers/foundItemController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.post("/", protect, upload.single("photo"), createFoundItem);
router.get("/", getFoundItems);
router.put("/:id", protect, upload.single("photo"), updateFoundItem);
router.delete("/:id", protect, deleteFoundItem);

module.exports = router;
