import React, { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import ImageModal from './ImageModal';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount / 100);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
  const hasDiscount = product.discount > 0;

  // Prepare images array for carousel
  const getProductImages = () => {
    const images = [];
    
    // Use images array if available (new format)
    if (product.images && product.images.length > 0) {
      images.push(...product.images.map(img => `http://localhost:5000/uploads/${img}`));
    }
    // Fallback to single image (backward compatibility)
    else if (product.image) {
      images.push(`http://localhost:5000/uploads/${product.image}`);
    }
    
    return images;
  };

  const handleImageClick = (index) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="product-card">
      <ImageCarousel 
        images={getProductImages()} 
        productName={product.name}
        onImageClick={handleImageClick}
      />
      
      <ImageModal
        images={getProductImages()}
        currentIndex={modalImageIndex}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        productName={product.name}
      />
      
      <div className="product-header">
        <div>
          <h3 className="product-name">{product.name}</h3>
          <span className="product-id">ID: {product.productId}</span>
        </div>
        {hasDiscount && (
          <span className="product-discount">
            -{product.discount}%
          </span>
        )}
      </div>

      <div className="product-price">
        {hasDiscount ? (
          <div>
            <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1rem' }}>
              {formatPrice(product.price)}
            </span>
            <br />
            <span style={{ color: '#28a745' }}>
              {formatPrice(discountedPrice)}
            </span>
          </div>
        ) : (
          formatPrice(product.price)
        )}
      </div>

      <div className="product-category">
        {product.category}
      </div>

      <p className="product-description">
        {product.description}
      </p>

      <div className="product-actions">
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onEdit(product)}
        >
          Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(product)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
