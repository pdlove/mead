// src/pages/EmailSettingsPage.jsx
import React, { useState, useEffect } from 'react';
import { getEmailSettings, saveEmailSettings } from '../services/apiService';
import './EmailSettingsPage.css'; // Import the new CSS file

const EmailSettingsPage = () => {
    // State to hold the form data
    const [settings, setSettings] = useState({
        smtpHost: '',
        smtpPort: 587,
        smtpSecure: false,
        smtpUser: '',
        smtpPass: '',
        fromAddress: '',
        toAddresses: '',
    });

    // State for UI feedback
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch email settings when the component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await getEmailSettings();
                // If data exists, update the form state
                if (data) {
                    setSettings({
                        smtpHost: data.smtpHost || '',
                        smtpPort: data.smtpPort || 587,
                        smtpSecure: data.smtpSecure || false,
                        smtpUser: data.smtpUser || '',
                        smtpPass: data.smtpPass || '',
                        fromAddress: data.fromAddress || '',
                        toAddresses: data.toAddresses || '',
                    });
                }
            } catch (err) {
                console.error("Failed to fetch email settings:", err);
                setError(err.message || 'Failed to load settings.');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []); // Empty dependency array means this runs once on mount

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prevSettings => ({
            ...prevSettings,
            [name]: type === 'checkbox' ? checked : value,
        }));
        // Clear messages on input change
        setSuccessMessage('');
        setError(null);
    };

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Basic validation
        if (!settings.smtpHost || !settings.smtpPort || !settings.fromAddress || !settings.toAddresses) {
            setError('Please fill in all required fields (SMTP Host, Port, From Address, To Addresses).');
            return;
        }
        if (isNaN(settings.smtpPort) || settings.smtpPort <= 0) {
            setError('SMTP Port must be a valid positive number.');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            await saveEmailSettings(settings);
            setSuccessMessage('Email settings saved successfully!');
            // Re-fetch to ensure the latest data is displayed (e.g., if backend sanitizes/changes something)
            const updatedData = await getEmailSettings();
            if (updatedData) {
                 setSettings({
                    smtpHost: updatedData.smtpHost || '',
                    smtpPort: updatedData.smtpPort || 587,
                    smtpSecure: updatedData.smtpSecure || false,
                    smtpUser: updatedData.smtpUser || '',
                    smtpPass: updatedData.smtpPass || '',
                    fromAddress: updatedData.fromAddress || '',
                    toAddresses: updatedData.toAddresses || '',
                });
            }
        } catch (err) {
            console.error("Failed to save email settings:", err);
            setError(err.message || 'Failed to save settings. Check server logs.');
        } finally {
            setLoading(false);
        }
    };

    // Render loading, error, or the form
    if (loading) {
        return <div className="email-settings-container">Loading email settings...</div>;
    }

    return (
        <div className="email-settings-container"> {/* Apply container class */}
            <h2 className="email-settings-heading">Manage Email Settings</h2> {/* Apply heading class */}

            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            {error && (
                <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit}>
                {/* SMTP Host */}
                <div className="email-settings-form-group"> {/* Apply form group class */}
                    <label htmlFor="smtpHost" className="email-settings-label">SMTP Host:</label> {/* Apply label class */}
                    <input
                        type="text"
                        id="smtpHost"
                        name="smtpHost"
                        value={settings.smtpHost}
                        onChange={handleChange}
                        required
                        className="email-settings-input"
                    />
                </div>

                {/* SMTP Port */}
                <div className="email-settings-form-group">
                    <label htmlFor="smtpPort" className="email-settings-label">SMTP Port:</label>
                    <input
                        type="number"
                        id="smtpPort"
                        name="smtpPort"
                        value={settings.smtpPort}
                        onChange={handleChange}
                        required
                        className="email-settings-input"
                    />
                </div>

                {/* SMTP Secure */}
                <div className="email-settings-form-group">
                    <input
                        type="checkbox"
                        id="smtpSecure"
                        name="smtpSecure"
                        checked={settings.smtpSecure}
                        onChange={handleChange}
                        className="email-settings-checkbox"
                    />
                    <label htmlFor="smtpSecure" className="email-settings-label">Use SSL/TLS (Secure Connection)</label>
                </div>

                {/* SMTP User */}
                <div className="email-settings-form-group">
                    <label htmlFor="smtpUser" className="email-settings-label">SMTP Username (optional):</label>
                    <input
                        type="text"
                        id="smtpUser"
                        name="smtpUser"
                        value={settings.smtpUser}
                        onChange={handleChange}
                        className="email-settings-input"
                    />
                </div>

                {/* SMTP Pass */}
                <div className="email-settings-form-group">
                    <label htmlFor="smtpPass" className="email-settings-label">SMTP Password (optional):</label>
                    <input
                        type="password"
                        id="smtpPass"
                        name="smtpPass"
                        value={settings.smtpPass}
                        onChange={handleChange}
                        className="email-settings-input"
                    />
                </div>

                {/* From Address */}
                <div className="email-settings-form-group">
                    <label htmlFor="fromAddress" className="email-settings-label">From Email Address:</label>
                    <input
                        type="email"
                        id="fromAddress"
                        name="fromAddress"
                        value={settings.fromAddress}
                        onChange={handleChange}
                        required
                        className="email-settings-input"
                    />
                </div>

                {/* To Addresses */}
                <div className="email-settings-form-group">
                    <label htmlFor="toAddresses" className="email-settings-label">Recipient Email Addresses (comma-separated):</label>
                    <input
                        type="text"
                        id="toAddresses"
                        name="toAddresses"
                        value={settings.toAddresses}
                        onChange={handleChange}
                        required
                        className="email-settings-input"
                    />
                    <small className="email-settings-help-text">e.g., recipient1@example.com,recipient2@example.com</small> {/* Apply help text class */}
                </div>

                <button type="submit" disabled={loading} className="email-settings-button"> {/* Apply button class */}
                    {loading ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
};

export default EmailSettingsPage;