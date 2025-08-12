import React, { useState, useEffect } from 'react';

// Syncfusion components (assuming they are available in the environment)
// For a real project, you would install them: npm install @syncfusion/ej2-react-buttons @syncfusion/ej2-react-navigations @syncfusion/ej2-react-inputs
// and import them like:
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { MenuComponent } from '@syncfusion/ej2-react-navigations';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

// Mock Syncfusion components for demonstration purposes
// In a real application, you would use the actual Syncfusion imports.

const App = () => {
  const [selectedOrganization, setSelectedOrganization] = useState('Acme Corp');
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://placehold.co/40x40/cccccc/ffffff?text=JD',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);

  // Mock data for organizations
  const organizations = [
    { text: 'Acme Corp', id: 'org1' },
    { text: 'Globex Inc.', id: 'org2' },
    { text: 'Soylent Corp', id: 'org3' },
  ];

  // Mock data for menu items
  const menuItems = [
    { text: 'Dashboard', url: '#' },
    { text: 'Projects', url: '#' },
    { text: 'Tasks', url: '#' },
    { text: 'Reports', url: '#' },
    { text: 'Settings', url: '#' },
  ];

  useEffect(() => {
    // Simulate new notifications arriving
    const notificationTimer = setTimeout(() => {
      setNotifications(prev => [...prev, { id: Date.now(), message: 'New message received!' }]);
      setHasNewNotifications(true);
    }, 5000); // After 5 seconds, a new notification arrives

    // Clear notifications after a while for demonstration
    const clearNotificationTimer = setTimeout(() => {
      setHasNewNotifications(false);
      // setNotifications([]); // Optionally clear all notifications
    }, 10000); // Clear flashing after 10 seconds

    return () => {
      clearTimeout(notificationTimer);
      clearTimeout(clearNotificationTimer);
    };
  }, [notifications.length]); // Re-run effect when notification count changes

  const handleOrganizationChange = (args) => {
    setSelectedOrganization(args.item.text);
  };

  const handleSearchChange = (args) => {
    setSearchTerm(args.value);
    console.log('Search term:', args.value);
  };

  const handleNotificationsClick = () => {
    setHasNewNotifications(false); // Mark notifications as read
    console.log('Notifications clicked. Current notifications:', notifications);
    // In a real app, you would open a notification panel or navigate to a notifications page
  };

  return (
    <div className="app-container">
      {/* CSS Styles */}
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        body {
          margin: 0;
          font-family: 'Inter', sans-serif;
        }

        .app-container {
          min-height: 100vh;
          background-color: #f3f4f6; /* gray-100 */
          color: #1f2937; /* gray-900 */
        }

        /* Header */
        .header {
          background-color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          padding: 1rem; /* p-4 */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          gap: 1rem; /* space-y-4 */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .header {
            flex-direction: row;
            padding-left: 1.5rem; /* md:px-6 */
            padding-right: 1.5rem; /* md:px-6 */
            gap: 0; /* md:space-y-0 */
          }
        }

        /* Left Section */
        .header-left-section {
          display: flex;
          align-items: center;
          gap: 1rem; /* space-x-4 */
          width: 100%;
          justify-content: space-between;
        }

        @media (min-width: 768px) { /* md breakpoint */
          .header-left-section {
            width: auto;
            justify-content: flex-start;
          }
        }

        .logo-text {
          font-size: 1.5rem; /* text-2xl */
          font-weight: 700; /* font-bold */
          color: #4f46e5; /* indigo-600 */
          border-radius: 0.375rem; /* rounded-md */
          padding: 0.5rem; /* p-2 */
        }

        /* Dropdown Button Component */
        .dropdown-container {
          position: relative;
          display: inline-block;
          text-align: left;
        }

        .dropdown-button {
          display: inline-flex;
          justify-content: center;
          width: 100%;
          border-radius: 0.375rem; /* rounded-md */
          border: 1px solid #d1d5db; /* border-gray-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          padding: 0.5rem 1rem; /* px-4 py-2 */
          background-color: #ffffff;
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          color: #374151; /* text-gray-700 */
          cursor: pointer;
          transition: background-color 0.15s ease-in-out;
          outline: none; /* focus:outline-none */
        }

        .dropdown-button:hover {
          background-color: #f9fafb; /* hover:bg-gray-50 */
        }

        .dropdown-button:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5), 0 0 0 6px rgba(99, 102, 241, 0.25); /* focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */
        }

        .dropdown-button span {
          display: flex;
          align-items: center;
        }

        .dropdown-button svg {
          height: 1.25rem; /* h-5 */
          width: 1.25rem; /* w-5 */
          margin-right: 0.5rem; /* mr-2 */
          color: #6b7280; /* text-gray-500 */
        }

        .dropdown-arrow {
          margin-left: 0.5rem; /* ml-2 */
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          margin-top: 0.5rem; /* mt-2 */
          width: 14rem; /* w-56 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          background-color: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.05); /* ring-1 ring-black ring-opacity-5 */
          outline: none; /* focus:outline-none */
          z-index: 10;
        }

        .dropdown-menu-items {
          padding-top: 0.25rem; /* py-1 */
          padding-bottom: 0.25rem; /* py-1 */
        }

        .dropdown-menu-item {
          display: block;
          padding: 0.5rem 1rem; /* px-4 py-2 */
          font-size: 0.875rem; /* text-sm */
          color: #374151; /* text-gray-700 */
          text-decoration: none;
        }

        .dropdown-menu-item:hover {
          background-color: #f3f4f6; /* hover:bg-gray-100 */
        }

        /* Search Box */
        .search-box-wrapper {
          width: 100%;
          padding-left: 1rem; /* px-4 */
          padding-right: 1rem; /* px-4 */
          display: none; /* hidden */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .search-box-wrapper {
            width: 33.333333%; /* md:w-1/3 */
            display: block; /* md:block */
          }
        }

        .text-box-input {
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
          border: 1px solid #d1d5db; /* border-gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          padding: 0.5rem; /* p-2 */
          display: block;
          width: 100%;
          font-size: 0.875rem; /* sm:text-sm */
          outline: none;
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }

        .text-box-input:focus {
          border-color: #6366f1; /* focus:border-indigo-500 */
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5); /* focus:ring-indigo-500 */
        }

        /* Right Section */
        .header-right-section {
          display: flex;
          align-items: center;
          gap: 1rem; /* space-x-4 */
          width: 100%;
          justify-content: flex-end;
        }

        @media (min-width: 768px) { /* md breakpoint */
          .header-right-section {
            width: auto;
          }
        }

        /* Notifications Icon */
        .notification-button {
          position: relative;
          padding: 0.5rem; /* p-2 */
          border-radius: 9999px; /* rounded-full */
          color: #4b5563; /* text-gray-600 */
          transition: background-color 0.15s ease-in-out;
          outline: none;
        }

        .notification-button:hover {
          background-color: #e5e7eb; /* hover:bg-gray-200 */
        }

        .notification-button:focus {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5), 0 0 0 6px rgba(99, 102, 241, 0.25); /* focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 */
        }

        .notification-icon {
          height: 1.5rem; /* h-6 */
          width: 1.5rem; /* w-6 */
          color: #4b5563; /* text-gray-600 */
        }

        .notification-icon.flash-animation {
          color: #ef4444; /* text-red-500 */
          animation: flash 1s infinite;
        }

        @keyframes flash {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }

        .notification-badge {
          position: absolute;
          top: 0.25rem; /* top-1 */
          right: 0.25rem; /* right-1 */
          display: block;
          height: 0.5rem; /* h-2 */
          width: 0.5rem; /* w-2 */
          border-radius: 9999px; /* rounded-full */
          background-color: #ef4444; /* bg-red-500 */
          border: 2px solid #ffffff; /* ring-2 ring-white */
        }

        /* User Profile */
        .user-profile-card {
          display: flex;
          align-items: center;
          gap: 0.5rem; /* space-x-2 */
          cursor: pointer;
          padding: 0.5rem; /* p-2 */
          border-radius: 0.375rem; /* rounded-md */
          transition: background-color 0.15s ease-in-out;
        }

        .user-profile-card:hover {
          background-color: #e5e7eb; /* hover:bg-gray-200 */
        }

        .user-avatar {
          height: 2.5rem; /* h-10 */
          width: 2.5rem; /* w-10 */
          border-radius: 9999px; /* rounded-full */
          object-fit: cover;
        }

        .user-info {
          display: none; /* hidden */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .user-info {
            display: block; /* sm:block */
          }
        }

        .user-name {
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          color: #1f2937; /* text-gray-800 */
        }

        .user-email {
          font-size: 0.75rem; /* text-xs */
          color: #6b7280; /* text-gray-500 */
        }

        /* Main Content Area */
        .main-content-area {
          display: flex;
          flex-direction: column;
        }

        @media (min-width: 768px) { /* md breakpoint */
          .main-content-area {
            flex-direction: row;
          }
        }

        /* Sidebar Navigation Menu */
        .sidebar {
          width: 100%;
          background-color: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          padding: 1rem; /* p-4 */
          border-right: 1px solid #e5e7eb; /* border-r border-gray-200 */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .sidebar {
            width: 16rem; /* md:w-64 */
            padding: 1.5rem; /* md:p-6 */
          }
        }

        .sidebar-heading {
          font-size: 1.125rem; /* text-lg */
          font-weight: 600; /* font-semibold */
          margin-bottom: 1rem; /* mb-4 */
          display: none; /* hidden */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .sidebar-heading {
            display: block; /* md:block */
          }
        }

        /* Menu Component */
        .menu-nav {
          flex-grow: 1;
          width: 100%;
        }

        .menu-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem; /* space-y-2 */
          list-style: none; /* Remove default list styling */
          padding: 0; /* Remove default padding */
          margin: 0; /* Remove default margin */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .menu-list {
            flex-direction: row;
            gap: 1rem; /* md:space-x-4 */
            margin-top: 0; /* md:space-y-0 */
          }
        }

        .menu-item-link {
          color: #374151; /* text-gray-700 */
          text-decoration: none;
          padding: 0.5rem 0.75rem; /* px-3 py-2 */
          border-radius: 0.375rem; /* rounded-md */
          font-size: 0.875rem; /* text-sm */
          font-weight: 500; /* font-medium */
          display: block; /* Ensure the whole area is clickable */
          transition: color 0.15s ease-in-out;
        }

        .menu-item-link:hover {
          color: #4f46e5; /* hover:text-indigo-600 */
        }

        /* Main Content */
        .main-content {
          flex: 1; /* flex-1 */
          padding: 1rem; /* p-4 */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .main-content {
            padding: 1.5rem; /* md:p-6 */
          }
        }

        .welcome-heading {
          font-size: 1.875rem; /* text-3xl */
          font-weight: 700; /* font-bold */
          color: #1f2937; /* text-gray-800 */
          margin-bottom: 1.5rem; /* mb-6 */
        }

        .organization-info {
          color: #374151; /* text-gray-700 */
          margin-bottom: 1rem; /* mb-4 */
        }

        .organization-name {
          font-weight: 600; /* font-semibold */
          color: #4f46e5; /* text-indigo-600 */
        }

        .dashboard-card {
          background-color: #ffffff;
          padding: 1.5rem; /* p-6 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
        }

        .dashboard-card-title {
          font-size: 1.25rem; /* text-xl */
          font-weight: 600; /* font-semibold */
          margin-bottom: 0.75rem; /* mb-3 */
        }

        .dashboard-card-text {
          color: #4b5563; /* text-gray-600 */
        }

        .notification-list-container {
          margin-top: 1rem; /* mt-4 */
          padding: 0.75rem; /* p-3 */
          background-color: #e0f2fe; /* bg-blue-100 */
          border: 1px solid #bfdbfe; /* border-blue-200 */
          color: #1e40af; /* text-blue-800 */
          border-radius: 0.375rem; /* rounded-md */
        }

        .notification-list-heading {
          font-weight: 600; /* font-semibold */
        }

        .notification-list {
          list-style: disc;
          list-style-position: inside;
          padding-left: 0; /* Remove default padding */
        }
        `}
      </style>

      {/* Header */}
      <header className="header">
        {/* Left Section: Logo/App Name & Organization Selector */}
        <div className="header-left-section">
          <div className="organization-selector-wrapper">
            <DropDownButtonComponent
              items={organizations}
              select={handleOrganizationChange}
            >              
                {selectedOrganization}
            </DropDownButtonComponent>
          </div>
        </div>

        {/* Center Section: Search Box (hidden on small screens, shown on medium and up) */}
        <div className="search-box-wrapper">
          <TextBoxComponent
            value={searchTerm}
            placeholder="Search..."
            change={handleSearchChange}
          />
        </div>

        {/* Right Section: Notifications, User Profile */}
        <div className="header-right-section">
          {/* Notifications Icon */}
          <button
            onClick={handleNotificationsClick}
            className="notification-button"
            aria-label="Notifications"
          >
            <svg
              className={`notification-icon ${hasNewNotifications ? 'flash-animation' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {hasNewNotifications && (
              <span className="notification-badge"></span>
            )}
          </button>

          {/* User Profile */}
          <div className="user-profile-card">
            <img
              className="user-avatar"
              src={userProfile.avatar}
              alt={userProfile.name}
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/cccccc/ffffff?text=JD"; }} // Fallback image
            />
            <div className="user-info">
              <div className="user-name">{userProfile.name}</div>
              <div className="user-email">{userProfile.email}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="main-content-area">
        {/* Sidebar Navigation Menu */}
        <aside className="sidebar">
          <h2 className="sidebar-heading">Navigation</h2>
          <MenuComponent items={menuItems} />
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1 className="welcome-heading">Welcome, {userProfile.name}!</h1>
          <p className="organization-info">
            You are currently viewing data for the organization: <span className="organization-name">{selectedOrganization}</span>.
          </p>
          <div className="dashboard-card">
            <h2 className="dashboard-card-title">Dashboard Overview</h2>
            <p className="dashboard-card-text">
              This is where your main application content would go. You can add more Syncfusion components here
              like Grids, Charts, Calendars, etc., to display relevant information based on the selected organization.
            </p>
            {notifications.length > 0 && (
              <div className="notification-list-container">
                <h3 className="notification-list-heading">Recent Notifications:</h3>
                <ul className="notification-list">
                  {notifications.map((notif) => (
                    <li key={notif.id}>{notif.message}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
