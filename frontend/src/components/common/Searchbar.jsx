import React from 'react';

export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      className="search-bar"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder || "Search student name, number, or equipment..."}
    />
  );
}
