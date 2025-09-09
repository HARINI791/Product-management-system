import React, { useState, useEffect } from 'react';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    productId: '',
    price: '',
    category: '',
    discount: '',
    description: ''
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        productId: product.productId || '',
        price: product.price || '',
        category: product.category || '',
        discount: product.discount || '',
        description: product.description || ''
      });
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images.map(img => `http://localhost:5000/uploads/${img}`));
      } else if (product.image) {
        setImagePreviews([`http://localhost:5000/uploads/${product.image}`]);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      // Check if adding new files would exceed the limit
      const totalFiles = imageFiles.length + newFiles.length;
      if (totalFiles > 5) {
        alert('You can only upload up to 5 images total. Please remove some images first.');
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Combine existing files with new files
      const combinedFiles = [...imageFiles, ...newFiles];
      setImageFiles(combinedFiles);
      
      // Create preview URLs for new files only
      const newPreviews = [];
      let loadedCount = 0;
      
      newFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews[index] = e.target.result;
          loadedCount++;
          
          if (loadedCount === newFiles.length) {
            // Combine existing previews with new previews
            setImagePreviews([...imagePreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
    
    // Clear the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.productId.trim()) {
      newErrors.productId = 'Product ID is required';
    }

    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.discount && (isNaN(formData.discount) || parseFloat(formData.discount) < 0 || parseFloat(formData.discount) > 100)) {
      newErrors.discount = 'Discount must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        imageFiles: imageFiles
      };
      onSubmit(submitData);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button className="close-btn" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="productId">Product ID *</label>
            <input
              type="text"
              id="productId"
              name="productId"
              className={`form-control ${errors.productId ? 'error' : ''}`}
              value={formData.productId}
              onChange={handleChange}
              placeholder="Enter unique product ID"
            />
            {errors.productId && <div className="error-message">{errors.productId}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              min="0"
              className={`form-control ${errors.price ? 'error' : ''}`}
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />
            {errors.price && <div className="error-message">{errors.price}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              className={`form-control ${errors.category ? 'error' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Electronics">Electronics</option>
              <option value="Makeup">Makeup</option>
              <option value="Clothing">Clothing</option>
              <option value="Books">Books</option>
              <option value="Home & Garden">Home & Garden</option>
              <option value="Sports & Outdoors">Sports & Outdoors</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Toys & Games">Toys & Games</option>
              <option value="Automotive">Automotive</option>
              <option value="Food & Beverages">Food & Beverages</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Shoes">Shoes</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && <div className="error-message">{errors.category}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="discount">Discount (%)</label>
            <input
              type="number"
              id="discount"
              name="discount"
              min="0"
              max="100"
              step="0.01"
              className={`form-control ${errors.discount ? 'error' : ''}`}
              value={formData.discount}
              onChange={handleChange}
              placeholder="Enter discount percentage (optional)"
            />
            {errors.discount && <div className="error-message">{errors.discount}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className={`form-control ${errors.description ? 'error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
            />
            {errors.description && <div className="error-message">{errors.description}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="images">Product Images (up to 5)</label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              multiple
              className="form-control"
              onChange={handleImageChange}
            />
            <small className="form-text">
              {imagePreviews.length === 0 
                ? "Select one or more images to upload" 
                : `You can add ${5 - imagePreviews.length} more image(s)`}
            </small>
            {imagePreviews.length > 0 && (
              <div className="image-previews">
                <p className="image-count">Selected {imagePreviews.length} image(s)</p>
                <div className="preview-grid">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview-item">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm remove-image-btn"
                        onClick={() => {
                          const newFiles = imageFiles.filter((_, i) => i !== index);
                          const newPreviews = imagePreviews.filter((_, i) => i !== index);
                          setImageFiles(newFiles);
                          setImagePreviews(newPreviews);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {imagePreviews.length < 5 && (
                  <div className="add-more-images">
                    <label htmlFor="add-more-images" className="btn btn-outline-primary btn-sm">
                      Add More Images
                    </label>
                    <input
                      type="file"
                      id="add-more-images"
                      accept="image/*"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
