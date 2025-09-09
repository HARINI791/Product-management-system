import React from 'react';

const ConfirmationModal = ({ 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmClass = 'btn-danger'
}) => {
  return (
    <div className="modal">
      <div className="modal-content confirmation-modal">
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
        </div>
        
        <p className="confirmation-message">{message}</p>
        
        <div className="confirmation-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`btn ${confirmClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
