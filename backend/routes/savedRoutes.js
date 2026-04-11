const express = require('express');
const router = express.Router();
const {
  getSavedItems,
  saveItem,
  unsaveItem
} = require('../controllers/savedController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSavedItems);
router.post('/', protect, saveItem);
router.delete('/:id', protect, unsaveItem);

module.exports = router;