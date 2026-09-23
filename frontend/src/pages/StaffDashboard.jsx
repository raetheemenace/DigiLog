import React, { useState, useEffect } from 'react';
import { getEquipments, getBorrowRecords, borrowItem, returnItem } from '../api/libraryApi';

export default function StaffDashboard() {
  const [records, setRecords] = useState([]);
  const [availableEquipments, setAvailableEquipments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    equipment_id: '',
    student_number: '',
    student_name: '',
    expected_return_at: '',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const recordsRes = await getBorrowRecords({
        status: filterStatus || undefined,
        search: searchTerm || undefined,
      });
      setRecords(recordsRes.data);

      const equipRes = await getEquipments({ status: 'available' });
      setAvailableEquipments(equipRes.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Cannot connect to Laravel API. Make sure "php artisan serve" is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterStatus, searchTerm]);

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await borrowItem(form);
      setForm({ equipment_id: '', student_number: '', student_name: '', expected_return_at: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating borrow record.');
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnItem(id);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error returning item.');
    }
  };

  return (
    <div>
      {/* Navigation Header */}
      <header className="navbar">
        <div className="nav-brand">DigiLog Desk</div>
        <nav className="nav-links">
          <a href="#" className="nav-link active">Dashboard</a>
          <a href="#" className="nav-link">Borrow Records</a>
          <a href="#" className="nav-link">Equipment Inventory</a>
        </nav>
      </header>

      <main className="container">
        <h1 className="page-title">Library Staff Equipment Desk</h1>
        <p className="page-subtitle">Track, issue, and manage borrowed hardware logbook records.</p>

        {error && <div className="alert-error">{error}</div>}

        {/* Issue Equipment Section */}
        <div className="card">
          <h2 className="card-title">Issue / Borrow Equipment</h2>
          <form onSubmit={handleBorrowSubmit} className="form-grid">
            <select
              className="select-field"
              required
              value={form.equipment_id}
              onChange={(e) => setForm({ ...form, equipment_id: e.target.value })}
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
              className="input-field"
              placeholder="Student Number (e.g. 2023-0192)"
              required
              value={form.student_number}
              onChange={(e) => setForm({ ...form, student_number: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Student Full Name"
              required
              value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
            />

            <input
              type="datetime-local"
              className="input-field"
              required
              value={form.expected_return_at}
              onChange={(e) => setForm({ ...form, expected_return_at: e.target.value })}
            />

            <button type="submit" className="btn btn-primary">
              Confirm Checkout
            </button>
          </form>
        </div>

        {/* Toolbar Filters */}
        <div className="toolbar">
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search student or item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className={`btn btn-filter ${filterStatus === '' ? 'active' : ''}`}
            onClick={() => setFilterStatus('')}
          >
            All
          </button>
          <button
            className={`btn btn-filter ${filterStatus === 'borrowed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('borrowed')}
          >
            Currently Borrowed
          </button>
          <button
            className={`btn btn-filter ${filterStatus === 'overdue' ? 'active' : ''}`}
            onClick={() => setFilterStatus('overdue')}
          >
            Overdue Only
          </button>
          <button
            className={`btn btn-filter ${filterStatus === 'returned' ? 'active' : ''}`}
            onClick={() => setFilterStatus('returned')}
          >
            Returned
          </button>
        </div>

        {/* Logbook Table */}
        <div className="table-card">
          {loading ? (
            <p style={{ padding: '20px', color: '#64748b' }}>Loading logbook...</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Student</th>
                  <th>Borrowed At</th>
                  <th>Expected Return</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', color: '#64748b' }}>
                      No logbook records found.
                    </td>
                  </tr>
                ) : (
                  records.map((rec) => {
                    const isReturned = rec.returned_at !== null;
                    const isOverdue = rec.is_overdue;

                    return (
                      <tr key={rec.id}>
                        <td>
                          <strong>{rec.equipment?.name}</strong>
                          <span className="subtext">{rec.equipment?.serial_number}</span>
                        </td>
                        <td>
                          <strong>{rec.student?.name}</strong>
                          <span className="subtext">{rec.student?.student_number}</span>
                        </td>
                        <td>{new Date(rec.borrowed_at).toLocaleString()}</td>
                        <td>{new Date(rec.expected_return_at).toLocaleString()}</td>
                        <td>
                          {isReturned ? (
                            <span className="badge badge-returned">Returned</span>
                          ) : isOverdue ? (
                            <span className="badge badge-overdue">OVERDUE</span>
                          ) : (
                            <span className="badge badge-borrowed">Borrowed</span>
                          )}
                        </td>
                        <td>
                          {!isReturned && (
                            <button
                              className="btn btn-success"
                              onClick={() => handleReturn(rec.id)}
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
      </main>
    </div>
  );
}
