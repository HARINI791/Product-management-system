import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import ProductForm from './components/ProductForm';
import ConfirmationModal from './components/ConfirmationModal';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (sortBy) params.append('sort', sortBy);
      if (categoryFilter) params.append('category', categoryFilter);
      
      const response = await axios.get(`${API_BASE_URL}/products?${params}`);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load products on component mount and when search/sort/category changes
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, sortBy, categoryFilter]);

  // Add new product
  const handleAddProduct = async (productData) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/products`, productData);
      setProducts([...products, response.data]);
      setShowForm(false);
      setSuccess('Product added successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
      console.error('Error adding product:', err);
    }
  };

  // Update existing product
  const handleUpdateProduct = async (productData) => {
    try {
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/products/${editingProduct._id}`, productData);
      setProducts(products.map(p => p._id === editingProduct._id ? response.data : p));
      setShowForm(false);
      setEditingProduct(null);
      setSuccess('Product updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product. Please try again.');
      console.error('Error updating product:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      setError(null);
      await axios.delete(`${API_BASE_URL}/products/${productToDelete._id}`);
      setProducts(products.filter(p => p._id !== productToDelete._id));
      setShowDeleteModal(false);
      setProductToDelete(null);
      setSuccess('Product deleted successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
      console.error('Error deleting product:', err);
    }
  };

  // Handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  // Handle form submission
  const handleFormSubmit = (productData) => {
    if (editingProduct) {
      handleUpdateProduct(productData);
    } else {
      handleAddProduct(productData);
    }
  };

  // Handle form cancel
  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Product Management System</h1>
          <p>Manage your products with ease</p>
        </header>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <div className="search-sort-container">
          <div className="search-input">
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="category-filter">
            <select
              className="form-control"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="">All Categories</option>
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
          </div>
          <div className="sort-select">
            <select
              className="form-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort by...</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            Add New Product
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.length === 0 ? (
              <div className="loading">No products found. Add your first product!</div>
            ) : (
              products.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))
            )}
          </div>
        )}

        {showForm && (
          <ProductForm
            product={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        )}

        {showDeleteModal && (
          <ConfirmationModal
            title="Delete Product"
            message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
            onConfirm={handleDeleteProduct}
            onCancel={() => {
              setShowDeleteModal(false);
              setProductToDelete(null);
            }}
            confirmText="Delete"
            confirmClass="btn-danger"
          />
        )}
      </div>
    </div>
  );
}

export default App;
