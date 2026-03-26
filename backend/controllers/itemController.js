import fs from 'fs';
import itemModel from '../models/itemModel.js';

// Add new item
const additem = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
console.log("REQ FILE:", req.file);

    // Validation: check for image upload
    if (!req.file || !req.file.filename) {
      return res.status(400).json({ success: false, message: 'Image file is required.' });
    }
    const image_filename = req.file.filename;

    // Validate other required fields & parse price
    const { name, description, price, category, productType } = req.body;
    if (!name || !description || !price || !category || !productType) {
      return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }
    const itemPrice = Number(price);
    if (isNaN(itemPrice)) {
      return res.status(400).json({ success: false, message: 'Price must be a valid number.' });
    }

    const item = new itemModel({
      name,
      description,
      price: itemPrice,
      category,
      image: image_filename,
      productType,
    });

    await item.save();
    res.json({ success: true, message: 'Item added', data: item });
  } catch (error) {
    console.log('AddItem Error:', error);
    res.status(500).json({ success: false, message: 'Error adding item', error: error.message });
  }
};

// List all items
const listitem = async (req, res) => {
  try {
    const items = await itemModel.find({});
    res.json({ success: true, data: items });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error fetching items', error: error.message });
  }
};

// Remove item
const removeitem = async (req, res) => {
  try {
    const item = await itemModel.findById(req.body.id);

    // Remove image file safely
    if (item && item.image) {
      fs.unlink(`uploads/${item.image}`, err => {
        if (err) console.log('File delete error:', err);
      });
    }

    await itemModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Item removed' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error removing item', error: error.message });
  }
};

export { additem, listitem, removeitem };
