import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="brand">DigiLog</div>
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          Dashboard
        </NavLink>
        <NavLink to="/returned" className={({ isActive }) => (isActive ? 'active' : '')}>
          Returned
        </NavLink>
        <NavLink to="/unreturned" className={({ isActive }) => (isActive ? 'active' : '')}>
          Unreturned
        </NavLink>
        <NavLink to="/equipment" className={({ isActive }) => (isActive ? 'active' : '')}>
          Equipment
        </NavLink>
      </div>
    </nav>
  );
}
