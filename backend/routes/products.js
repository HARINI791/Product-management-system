const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { upload, generateFilename } = require('../middleware/upload');
const { processImageBuffer } = require('../middleware/imageProcessor');
const path = require('path');
const router = express.Router();

// Test endpoint for file upload (remove in production)
router.post('/test-upload', upload.single('image'), (req, res) => {
  console.log('Test upload - Request body:', req.body);
  console.log('Test upload - Request file:', req.file);
  res.json({ 
    message: 'Upload test successful', 
    file: req.file,
    body: req.body 
  });
});

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
router.post('/', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => { // Allow up to 5 images
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    next();
  });
}, auth, async (req, res) => {
  try {
    console.log('POST Request body:', req.body);
    console.log('POST Request files:', req.files ? `${req.files.length} files received` : 'No files');
    
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
    
    let imageFilename = null;
    let imageFilenames = [];
    
    // Process images if provided
    if (req.files && req.files.length > 0) {
      try {
        console.log(`Processing ${req.files.length} images...`);
        
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const filename = generateFilename(file.originalname);
          const outputPath = path.join('uploads', filename);
          
          const success = await processImageBuffer(file.buffer, outputPath);
          
          if (success) {
            imageFilenames.push(filename);
            if (i === 0) imageFilename = filename; // Keep first image as main image for backward compatibility
            console.log(`Image ${i + 1} processed and saved:`, filename);
          } else {
            console.error(`Failed to process image ${i + 1}`);
          }
        }
        
        if (imageFilenames.length === 0) {
          return res.status(500).json({ message: 'Failed to process any images' });
        }
      } catch (error) {
        console.error('Image processing error:', error);
        return res.status(500).json({ message: 'Image processing failed' });
      }
    }
    
    const product = new Product({
      name,
      productId,
      price: parseFloat(price),
      category,
      discount: discount ? parseFloat(discount) : 0,
      description,
      image: imageFilename, // Main image for backward compatibility
      images: imageFilenames // Array of all images
    });
    
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    console.error('Error stack:', error.stack);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Product ID already exists' });
    } else {
      res.status(500).json({ message: 'Error creating product: ' + error.message });
    }
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => { // Allow up to 5 images
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ message: 'File upload error: ' + err.message });
    }
    next();
  });
}, auth, async (req, res) => {
  try {
    console.log('PUT Request body:', req.body);
    console.log('PUT Request files:', req.files ? `${req.files.length} files received` : 'No files');
    
    const { name, productId, price, category, discount, description } = req.body;
    
    // Validation
    if (!name || !productId || !price || !category || !description) {
      return res.status(400).json({ 
        message: 'All fields (name, productId, price, category, description) are required' 
      });
    }
    
    // Check if productId already exists (excluding current product)
    const existingProductWithSameId = await Product.findOne({ 
      productId, 
      _id: { $ne: req.params.id } 
    });
    if (existingProductWithSameId) {
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

    // Get existing product to preserve existing images
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process new images if provided
    if (req.files && req.files.length > 0) {
      try {
        console.log(`Processing ${req.files.length} images for update...`);
        
        const newImageFilenames = [];
        
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const filename = generateFilename(file.originalname);
          const outputPath = path.join('uploads', filename);
          
          const success = await processImageBuffer(file.buffer, outputPath);
          
          if (success) {
            newImageFilenames.push(filename);
            console.log(`Image ${i + 1} processed and saved for update:`, filename);
          } else {
            console.error(`Failed to process image ${i + 1} for update`);
          }
        }
        
        if (newImageFilenames.length > 0) {
          // Combine existing images with new images
          const existingImages = existingProduct.images || [];
          const combinedImages = [...existingImages, ...newImageFilenames];
          
          updateData.images = combinedImages;
          updateData.image = combinedImages[0]; // Set first image as main image
          
          console.log(`Updated images array with ${combinedImages.length} total images`);
        }
      } catch (error) {
        console.error('Image processing error for update:', error);
        return res.status(500).json({ message: 'Image processing failed' });
      }
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
