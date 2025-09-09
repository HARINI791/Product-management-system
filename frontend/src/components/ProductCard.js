import React from 'react';

const ProductCard = ({ product, onEdit, onDelete }) => {
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

  return (
    <div className="product-card">
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
