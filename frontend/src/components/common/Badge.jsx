import React from 'react';

export default function Badge({ status, isOverdue }) {
  if (status === 'returned') {
    return <span className="badge badge-success">Returned</span>;
  }
  if (isOverdue) {
    return <span className="badge badge-danger">Overdue</span>;
  }
  return <span className="badge badge-warning">Pending</span>;
}
