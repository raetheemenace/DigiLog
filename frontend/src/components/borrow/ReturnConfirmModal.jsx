import React from 'react';

export default function ReturnConfirmModal({ isOpen, record, onClose, onConfirm }) {
  if (!isOpen || !record) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Confirm Return</h3>
        <p>
          Mark <strong>{record.equipment_name}</strong> as returned by{' '}
          <strong>{record.student_name}</strong>?
        </p>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onConfirm(record.id)} className="btn-primary">
            Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
}
