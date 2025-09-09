const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const router = express.Router();

// GET /api/products - Get all products
router.get('/', auth, async (req, res) => {
  try {
    const { search, sort, category } = req.query;
    let query = {};
    
    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    let products = Product.find(query);
    
    // Sort by price
    if (sort === 'price-asc') {
      products = products.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      products = products.sort({ price: -1 });
    } else {
      products = products.sort({ createdAt: -1 });
    }
    
    const result = await products.exec();
    res.json(result);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// GET /api/products/:id - Get single product
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// POST /api/products - Add new product
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, productId, price, category, discount, description } = req.body;
    
    // Validation
    if (!name || !productId || !price || !category || !description) {
      return res.status(400).json({ 
        message: 'All fields (name, productId, price, category, description) are required' 
      });
    }
    
    // Check if productId already exists
    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }
    
    const product = new Product({
      name,
      productId,
      price: parseFloat(price),
      category,
      discount: discount ? parseFloat(discount) : 0,
      description,
      image: req.file ? req.file.filename : null
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Product ID already exists' });
    } else {
      res.status(500).json({ message: 'Error creating product' });
    }
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { name, productId, price, category, discount, description } = req.body;
    
    // Validation
    if (!name || !productId || !price || !category || !description) {
      return res.status(400).json({ 
        message: 'All fields (name, productId, price, category, description) are required' 
      });
    }
    
    // Check if productId already exists (excluding current product)
    const existingProduct = await Product.findOne({ 
      productId, 
      _id: { $ne: req.params.id } 
    });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }
    
    const updateData = {
      name,
      productId,
      price: parseFloat(price),
      category,
      discount: discount ? parseFloat(discount) : 0,
      description
    };

    // Only update image if a new one is uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Product ID already exists' });
    } else {
      res.status(500).json({ message: 'Error updating product' });
    }
  }
});

// DELETE /api/products/:id - Delete product
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
