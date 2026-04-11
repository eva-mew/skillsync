const SavedItem = require('../models/SavedItem');

// @route  GET /api/saved
// @access Private
const getSavedItems = async (req, res) => {
  try {
    const savedItems = await SavedItem.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(savedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  POST /api/saved
// @access Private
const saveItem = async (req, res) => {
  try {
    const { itemId, itemType, itemTitle, itemCompany } = req.body;

    // Check if already saved
    const existing = await SavedItem.findOne({
      userId: req.user._id,
      itemId
    });

    if (existing) {
      return res.status(400).json({ message: 'Item already saved' });
    }

    const savedItem = await SavedItem.create({
      userId: req.user._id,
      itemId,
      itemType,
      itemTitle,
      itemCompany
    });

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/saved/:id
// @access Private
const unsaveItem = async (req, res) => {
  try {
    const item = await SavedItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: 'Saved item not found' });
    }

    res.json({ message: 'Item removed from saved list' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSavedItems, saveItem, unsaveItem };