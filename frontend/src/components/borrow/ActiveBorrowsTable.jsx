import React from 'react';
import Badge from '../common/Badge';

export default function ActiveBorrowsTable({ records, onReturnClick, searchTerm }) {
  const filteredRecords = records.filter((rec) => {
    const term = searchTerm.toLowerCase();
    return (
      rec.student_name.toLowerCase().includes(term) ||
      rec.student_number.toLowerCase().includes(term) ||
      rec.equipment_name.toLowerCase().includes(term)
    );
  });

  return (
    <table className="borrows-table">
      <thead>
        <tr>
          <th>Student Name</th>
          <th>Student #</th>
          <th>Item Borrowed</th>
          <th>Qty</th>
          <th>Date Borrowed</th>
          <th>Return Date</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredRecords.length === 0 ? (
          <tr>
            <td colSpan="8" style={{ textAlign: 'center' }}>No records found.</td>
          </tr>
        ) : (
          filteredRecords.map((row) => (
            <tr key={row.id}>
              <td>{row.student_name}</td>
              <td>{row.student_number}</td>
              <td>{row.equipment_name}</td>
              <td>{row.quantity}</td>
              <td>{new Date(row.date_borrowed).toLocaleString()}</td>
              <td>{new Date(row.return_date).toLocaleString()}</td>
              <td><Badge status={row.status} isOverdue={row.is_overdue} /></td>
              <td>
                {row.status !== 'returned' && (
                  <button onClick={() => onReturnClick(row)} className="btn-sm">
                    Return
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
