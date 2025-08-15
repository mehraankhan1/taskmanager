const LostItem = require("../models/lostItem");
const multer = require("multer");
const path = require("path");
// @desc Create a lost item
// @route POST /api/lost
// @access Private
const createLostItem = async (req, res) => {
  try {
    const { title, description, category, location, dateLost } = req.body;

    if (!title || !description || !location) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    // Multer puts uploaded file info in req.file
    const photoPath = req.file ? `/uploads/${req.file.filename}` : "";

    const lostItem = await LostItem.create({
      title,
      description,
      category,
      location,
      dateLost,
      photo: photoPath,
      createdBy: req.user.id,
    });

    res.status(201).json(lostItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder where images will be saved
  },
  filename: function (req, file, cb) {
    // unique filename: timestamp + original name
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// @desc Get all lost items
// @route GET /api/lost
// @access Public
const getLostItems = async (req, res) => {
  try {
    const { category, location } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };

    const items = await LostItem.find(filter).populate(
      "createdBy",
      "name email"
    );
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Lost Item
const updateLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Optional: Check if req.user.id === lostItem.user to allow only owner update

    // Update fields
    lostItem.title = req.body.title || lostItem.title;
    lostItem.description = req.body.description || lostItem.description;
    lostItem.category = req.body.category || lostItem.category;
    lostItem.location = req.body.location || lostItem.location;
    lostItem.photo = req.body.photo || lostItem.photo;

    const updatedLostItem = await lostItem.save();
    res.json(updatedLostItem);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Lost Item
const deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({ message: "Lost item not found" });
    }

    // Optional: Check if req.user.id === lostItem.user to allow only owner delete

    await lostItem.remove();
    res.json({ message: "Lost item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateLostItem,
  deleteLostItem,
  createLostItem,
  getLostItems,
};
