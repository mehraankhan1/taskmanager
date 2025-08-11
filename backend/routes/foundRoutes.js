const express = require("express");
const router = express.Router();
const {
  addFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
} = require("../controllers/foundController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post("/", authMiddleware, upload.single("photo"), addFoundItem);
router.get("/", getFoundItems); // Public, with search/filter
router.put("/:id", authMiddleware, updateFoundItem);
router.delete("/:id", authMiddleware, adminMiddleware, deleteFoundItem);

module.exports = router;
