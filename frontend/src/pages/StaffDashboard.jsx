import React, { useState, useEffect } from 'react';
import { getEquipments, getBorrowRecords, borrowItem, returnItem } from '../api/libraryApi';

export default function StaffDashboard() {
  const [records, setRecords] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [filterStatus, setFilterStatus] = useState(''); // '', 'borrowed', 'returned', 'overdue'
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form State for Borrow Modal / Desk Checkout
  const [form, setForm] = useState({
    equipment_id: '',
    student_number: '',
    student_name: '',
    expected_return_at: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch filtered logbook records
      const recordsRes = await getBorrowRecords({
        status: filterStatus || undefined,
        search: searchTerm || undefined,
      });
      setRecords(recordsRes.data);

      // 2. Fetch only available equipment for the dropdown selector
      const equipRes = await getEquipments({ status: 'available' });
      setAvailableEquipments(equipRes.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, searchTerm]);

  // Handle Checkout (POST /api/borrow-records)
  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await borrowItem(form);
      setForm({ equipment_id: '', student_number: '', student_name: '', expected_return_at: '' });
      fetchData(); // Refresh records and dropdown
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating borrow record.');
    }
  };

  // Handle Check-in (PATCH /api/borrow-records/{id}/return)
  const handleReturn = async (id) => {
    try {
      await returnItem(id);
      fetchData(); // Refresh records and mark item back to available
    } catch (err) {
      alert(err.response?.data?.message || 'Error returning item.');
    }
  };

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Library Staff Equipment Desk</h2>

      {error && (
        <div style={{ padding: '10px', background: '#fee2e2', color: '#b91c1c', marginBottom: '16px', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      {/* 1. CHECKOUT FORM (Student Standing at Desk) */}
      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
        <h3>Issue / Borrow Equipment</h3>
        <form onSubmit={handleBorrowSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          
          <select
            required
            value={form.equipment_id}
            onChange={(e) => setForm({ ...form, equipment_id: e.target.value })}
            style={{ padding: '8px' }}
          >
            <option value="">Select Available Item...</option>
            {availableEquipments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.category} - {item.serial_number})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Student Number (e.g. 2023-0192)"
            required
            value={form.student_number}
            onChange={(e) => setForm({ ...form, student_number: e.target.value })}
            style={{ padding: '8px' }}
          />

          <input
            type="text"
            placeholder="Student Full Name"
            required
            value={form.student_name}
            onChange={(e) => setForm({ ...form, student_name: e.target.value })}
            style={{ padding: '8px' }}
          />

          <input
            type="datetime-local"
            required
            value={form.expected_return_at}
            onChange={(e) => setForm({ ...form, expected_return_at: e.target.value })}
            style={{ padding: '8px' }}
          />

          <button type="submit" style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Confirm Checkout
          </button>
        </form>
      </div>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by student or item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', minWidth: '260px' }}
        />

        <button onClick={() => setFilterStatus('')} style={{ padding: '8px 14px', background: filterStatus === '' ? '#334155' : '#e2e8f0', color: filterStatus === '' ? '#fff' : '#000' }}>
          All
        </button>
        <button onClick={() => setFilterStatus('borrowed')} style={{ padding: '8px 14px', background: filterStatus === 'borrowed' ? '#d97706' : '#e2e8f0', color: filterStatus === 'borrowed' ? '#fff' : '#000' }}>
          Currently Borrowed
        </button>
        <button onClick={() => setFilterStatus('overdue')} style={{ padding: '8px 14px', background: filterStatus === 'overdue' ? '#dc2626' : '#e2e8f0', color: filterStatus === 'overdue' ? '#fff' : '#000' }}>
          Overdue Only
        </button>
        <button onClick={() => setFilterStatus('returned')} style={{ padding: '8px 14px', background: filterStatus === 'returned' ? '#16a34a' : '#e2e8f0', color: filterStatus === 'returned' ? '#fff' : '#000' }}>
          Returned
        </button>
      </div>

      {/* 3. LOGBOOK TABLE */}
      {loading ? (
        <p>Loading logbook...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
              <th style={{ padding: '10px' }}>Item</th>
              <th style={{ padding: '10px' }}>Student</th>
              <th style={{ padding: '10px' }}>Borrowed At</th>
              <th style={{ padding: '10px' }}>Expected Return</th>
              <th style={{ padding: '10px' }}>Status</th>
              <th style={{ padding: '10px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ padding: '12px', textAlign: 'center' }}>No logbook records found.</td>
              </tr>
            ) : (
              records.map((rec) => {
                const isReturned = rec.returned_at !== null;
                const isOverdue = rec.is_overdue;

                return (
                  <tr key={rec.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '10px' }}>
                      <strong>{rec.equipment?.name}</strong> <br />
                      <small style={{ color: '#64748b' }}>{rec.equipment?.serial_number}</small>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {rec.student?.name} <br />
                      <small style={{ color: '#64748b' }}>{rec.student?.student_number}</small>
                    </td>
                    <td style={{ padding: '10px' }}>{new Date(rec.borrowed_at).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>{new Date(rec.expected_return_at).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      {isReturned ? (
                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Returned</span>
                      ) : isOverdue ? (
                        <span style={{ color: '#dc2626', fontWeight: 'bold' }}>OVERDUE</span>
                      ) : (
                        <span style={{ color: '#d97706', fontWeight: 'bold' }}>Borrowed</span>
                      )}
                    </td>
                    <td style={{ padding: '10px' }}>
                      {!isReturned && (
                        <button
                          onClick={() => handleReturn(rec.id)}
                          style={{ padding: '6px 12px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Mark Returned
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
