const Wishlist = require('../models/Wishlist');

// @desc    Get user wishlist
// @route   GET /api/wishlist/my
// @access  Private
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.id })
      .populate('items', 'name image price originalPrice discount rating reviews category stock');
    if (!wishlist) {
      wishlist = { items: [] };
    }
    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/add
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID required' });

    let wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.id, items: [productId] });
    } else {
      if (!wishlist.items.includes(productId)) {
        wishlist.items.push(productId);
        wishlist.updatedAt = Date.now();
        await wishlist.save();
      }
    }
    const populated = await Wishlist.findById(wishlist._id)
      .populate('items', 'name image price originalPrice discount rating reviews category stock');
    res.json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/remove/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ userId: req.user.id });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(id => id.toString() !== productId);
      wishlist.updatedAt = Date.now();
      await wishlist.save();
    }
    const populated = await Wishlist.findOne({ userId: req.user.id })
      .populate('items', 'name image price originalPrice discount rating reviews category stock');
    res.json(populated || { items: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
