const FoundItem = require("../models/foundItem");
const multer = require("multer");
const path = require("path");
// @desc Create a found item
// @route POST /api/found
// @access Private
const createFoundItem = async (req, res) => {
  try {
    const { title, description, category, location, photo } = req.body;

    if (!title || !description || !location) {
      return res
        .status(400)
        .json({ message: "Please fill all required fields" });
    }

    const foundItem = await FoundItem.create({
      title,
      description,
      category,
      location,
      photo,
      createdBy: req.user.id,
    });

    res.status(201).json(foundItem);
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
// @desc Get all found items
// @route GET /api/found
// @access Public
const getFoundItems = async (req, res) => {
  try {
    const { category, location } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: "i" };

    const items = await FoundItem.find(filter).populate(
      "createdBy",
      "name email"
    );
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Update found item
// @route PUT /api/found/:id
// @access Private
const updateFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // Optional: Check ownership: if (foundItem.createdBy.toString() !== req.user.id) return res.status(401).json({message: 'Not authorized'});

    foundItem.title = req.body.title || foundItem.title;
    foundItem.description = req.body.description || foundItem.description;
    foundItem.category = req.body.category || foundItem.category;
    foundItem.location = req.body.location || foundItem.location;
    foundItem.photo = req.body.photo || foundItem.photo;

    const updatedItem = await foundItem.save();
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc Delete found item
// @route DELETE /api/found/:id
// @access Private
const deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);

    if (!foundItem) {
      return res.status(404).json({ message: "Found item not found" });
    }

    // Optional: Check ownership

    await foundItem.remove();
    res.json({ message: "Found item removed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
};
