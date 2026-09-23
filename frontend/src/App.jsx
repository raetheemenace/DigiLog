import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Dashboard from './pages/StaffDashboard';
import EquipmentPage from './pages/EquipmentPage';
import LogbookPage from './pages/LogbookPage';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard filterType="all" />} />
            <Route path="/returned" element={<Dashboard filterType="returned" />} />
            <Route path="/unreturned" element={<Dashboard filterType="unreturned" />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/logbook" element={<LogbookPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
