// src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import EmailSettingsPage from './pages/EmailSettingsPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import Dashboard from './pages/Dashboard';
import DeviceManagementPage from './pages/DeviceManagementPage'; // Import the new component
import './App.css'; // Import the CSS file

function App() {
  return (
    <div className="app-container">
      {/* Left Sidebar Menu */}
      <nav className="sidebar">
        <h2 className="sidebar-heading">Network Monitor</h2>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard (Home)</Link>
          </li>
          <li className="nav-item">
            <Link to="/devices" className="nav-link">Manage Devices</Link> {/* New link */}
          </li>
          <li className="nav-item">
            <Link to="/categories" className="nav-link">Manage Categories</Link>
          </li>
          <li className="nav-item">
            <Link to="/email-settings" className="nav-link">Email Settings</Link>
          </li>
          {/* Add more links as you create more components */}
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<DeviceManagementPage />} /> {/* New route */}
          <Route path="/categories" element={<CategoryManagementPage />} />
          <Route path="/email-settings" element={<EmailSettingsPage />} />
          {/* Add more routes here */}
        </Routes>
      </main>
    </div>
  );
}

// Simple Home Component Placeholder
const HomeDashboard = () => {
  return (
    <div className="home-dashboard-container">
      <h2>Welcome to Network Monitor!</h2>
      <p>Use the menu on the left to navigate.</p>
    </div>
  );
};

export default App;