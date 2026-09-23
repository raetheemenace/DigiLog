import React, { useState, useEffect } from 'react';
import { getEquipments } from '../../api/equipmentApi';
import { createBorrowRecord } from '../../api/borrowApi';

export default function BorrowFormModal({ isOpen, onClose, onSuccess }) {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    student_number: '',
    equipment_id: '',
    quantity: 1,
    date_borrowed: new Date().toISOString().slice(0, 16),
    return_date: '',
  });

  useEffect(() => {
    if (isOpen) {
      getEquipments('available').then(setEquipments).catch(console.error);
    }
  }, [isOpen]);

  const selectedItem = equipments.find((e) => e.id === Number(formData.equipment_id));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedItem && formData.quantity > selectedItem.available_quantity) {
      alert(`Cannot borrow more than available stock (${selectedItem.available_quantity})`);
      return;
    }
    setLoading(true);
    try {
      await createBorrowRecord(formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to submit borrow request.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Log Borrowed Equipment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student Name *"
            required
            value={formData.student_name}
            onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Student Number *"
            required
            value={formData.student_number}
            onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
          />
          <select
            required
            value={formData.equipment_id}
            onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
          >
            <option value="">Select Equipment *</option>
            {equipments.map((item) => (
              <option key={item.id} value={item.id} disabled={item.available_quantity === 0}>
                {item.name} (Available: {item.available_quantity})
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max={selectedItem?.available_quantity || 1}
            required
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
          />
          <label>Date Borrowed:</label>
          <input
            type="datetime-local"
            required
            value={formData.date_borrowed}
            onChange={(e) => setFormData({ ...formData, date_borrowed: e.target.value })}
          />
          <label>Return Date:</label>
          <input
            type="datetime-local"
            required
            value={formData.return_date}
            onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
