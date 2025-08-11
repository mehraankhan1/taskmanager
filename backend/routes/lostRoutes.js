const express = require("express");
const router = express.Router();
const {
  addLostItem,
  getLostItems,
  updateLostItem,
  deleteLostItem,
} = require("../controllers/lostController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", authMiddleware, upload.single("photo"), addLostItem);
router.get("/", getLostItems); // Public, with search/filter
router.put("/:id", authMiddleware, updateLostItem);
router.delete("/:id", authMiddleware, adminMiddleware, deleteLostItem);

module.exports = router;
