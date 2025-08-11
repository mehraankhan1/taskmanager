const FoundItem = require("../models/FoundItem");

const addFoundItem = async (req, res) => {
  const { title, description, location } = req.body;
  try {
    const photo = req.file ? req.file.path : "";
    const foundItem = await FoundItem.create({
      userId: req.user.id,
      title,
      description,
      location,
      photo,
    });
    res.status(201).json(foundItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFoundItems = async (req, res) => {
  try {
    const { status, keyword } = req.query;
    let query = {};
    if (status) query.status = status;
    if (keyword)
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];

    const foundItems = await FoundItem.find(query);
    res.json(foundItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFoundItem = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    if (!foundItem)
      return res.status(404).json({ message: "Found item not found" });
    // Check if user is owner or admin
    if (foundItem.userId.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    foundItem.title = title || foundItem.title;
    foundItem.description = description || foundItem.description;
    foundItem.status = status || foundItem.status;
    const updatedFoundItem = await foundItem.save();
    res.json(updatedFoundItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteFoundItem = async (req, res) => {
  try {
    const foundItem = await FoundItem.findById(req.params.id);
    if (!foundItem)
      return res.status(404).json({ message: "Found item not found" });
    // Admin only
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Admin access required" });

    await foundItem.deleteOne();
    res.json({ message: "Found item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addFoundItem,
  getFoundItems,
  updateFoundItem,
  deleteFoundItem,
};
