import React, { useState, useEffect } from 'react';

const ImageModal = ({ images, currentIndex, isOpen, onClose, productName }) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex || 0);

  // Update active index when currentIndex prop changes
  useEffect(() => {
    setActiveIndex(currentIndex || 0);
  }, [currentIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, images.length]);

  const goToPrevious = () => {
    setActiveIndex(activeIndex === 0 ? images.length - 1 : activeIndex - 1);
  };

  const goToNext = () => {
    setActiveIndex(activeIndex === images.length - 1 ? 0 : activeIndex + 1);
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  if (!isOpen || !images || images.length === 0) {
    return null;
  }

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="image-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Main Image Container */}
        <div className="image-modal-main">
          <img
            src={images[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            className="image-modal-image"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
            }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="image-modal-arrow image-modal-arrow-left"
                onClick={goToPrevious}
                aria-label="Previous image"
              >
                &#8249;
              </button>
              <button
                className="image-modal-arrow image-modal-arrow-right"
                onClick={goToNext}
                aria-label="Next image"
              >
                &#8250;
              </button>
            </>
          )}
        </div>

        {/* Image Counter */}
        <div className="image-modal-counter">
          {activeIndex + 1} / {images.length}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="image-modal-thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={`image-modal-thumbnail ${index === activeIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5FPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Name */}
        <div className="image-modal-title">
          {productName}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
