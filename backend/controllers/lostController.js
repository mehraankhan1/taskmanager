const LostItem = require("../models/LostItem");

const addLostItem = async (req, res) => {
  const { title, description, location } = req.body;
  try {
    const photo = req.file ? req.file.path : "";
    const lostItem = await LostItem.create({
      userId: req.user.id,
      title,
      description,
      location,
      photo,
    });
    res.status(201).json(lostItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLostItems = async (req, res) => {
  try {
    const { status, keyword } = req.query;
    let query = {};
    if (status) query.status = status;
    if (keyword)
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];

    const lostItems = await LostItem.find(query);
    res.json(lostItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLostItem = async (req, res) => {
  const { title, description, status } = req.body;
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem)
      return res.status(404).json({ message: "Lost item not found" });
    // Check if user is owner or admin
    if (lostItem.userId.toString() !== req.user.id && !req.user.isAdmin)
      return res.status(403).json({ message: "Access denied" });

    lostItem.title = title || lostItem.title;
    lostItem.description = description || lostItem.description;
    lostItem.status = status || lostItem.status;
    const updatedLostItem = await lostItem.save();
    res.json(updatedLostItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLostItem = async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);
    if (!lostItem)
      return res.status(404).json({ message: "Lost item not found" });
    // Admin only
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Admin access required" });

    await lostItem.deleteOne();
    res.json({ message: "Lost item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addLostItem, getLostItems, updateLostItem, deleteLostItem };
