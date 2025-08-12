// src/pages/Dashboard.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Sparklines, SparklinesLine, SparklinesSpots } from 'react-sparklines';
import './Dashboard.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

function Dashboard() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(false); // Keep for UI indicator
    const [error, setError] = useState(null);
    const [expandedDevices, setExpandedDevices] = useState({});

    // --- NEW: A ref to directly manage if a fetch is currently in progress ---
    // This ref's value can be read/written inside `useCallback` without triggering re-renders
    // or changing the `useCallback`'s identity.
    const isFetchingRef = useRef(false);

    // Helper to transform a flat list of devices into a hierarchical tree
    // This function is pure and doesn't depend on component state, so it's stable.
    const transformToTree = useCallback((flatDevices) => {
        const deviceMap = new Map(flatDevices.map(device => [device.id, { ...device, children: [] }]));
        const tree = [];

        deviceMap.forEach(device => {
            if (device.parentId) {
                const parent = deviceMap.get(device.parentId);
                if (parent) {
                    parent.children.push(device);
                } else {
                    // Handle orphaned devices (parent not found) - add to top level
                    console.warn(`Orphaned device found: ${device.name} (Parent ID: ${device.parentId} not found)`);
                    tree.push(device);
                }
            } else {
                tree.push(device); // Top-level device
            }
        });

        // Sort children for consistent display
        deviceMap.forEach(device => {
            if (device.children) {
                device.children.sort((a, b) => a.name.localeCompare(b.name));
            }
        });

        return tree.sort((a, b) => a.name.localeCompare(b.name)); // Sort top-level devices
    }, []); // Empty dependency array means this function is created only once.

    // Use useCallback to memoize the fetchDevices function
    // This is important for setInterval and useEffect dependencies
   const fetchDevices = useCallback(async () => {
        // Use the ref to check if a fetch is already in progress
        if (isFetchingRef.current) {
            console.log('Fetch already in progress, skipping.');
            return;
        }

        isFetchingRef.current = true; // Set ref to true at the start of the fetch
        setLoading(true); // Update state for UI loading indicator
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/devices`);
            const transformedDevices = transformToTree(response.data); // Use the memoized transformToTree
            setDevices(transformedDevices);
        } catch (err) {
            console.error('Error fetching devices:', err);
            setError('Failed to fetch devices. Please try again.');
        } finally {
            isFetchingRef.current = false; // Reset ref regardless of success or failure
            setLoading(false); // Update UI loading indicator
        }
    }, [transformToTree]); // fetchDevices depends on transformToTree, which is also stable.

    // useEffect hook to handle automatic data fetching via setInterval
    useEffect(() => {
        // Initial fetch on component mount
        fetchDevices();

        const intervalId = setInterval(() => {
            fetchDevices(); // Then, fetch data every 30 seconds
        }, 30 * 1000); // 30 seconds in milliseconds

        // Cleanup function: This runs when the component unmounts
        // or before the effect runs again (if dependencies change),
        // preventing memory leaks from the interval.
        return () => clearInterval(intervalId);
    }, [fetchDevices]); // <--- fetchDevices is now a stable dependency, so this effect runs only once on mount.

    const handleRefresh = () => {
        fetchDevices(); // The manual refresh button still works
    };

    const toggleExpand = (deviceId) => {
        setExpandedDevices(prev => ({
            ...prev,
            [deviceId]: !prev[deviceId]
        }));
    };

    // Recursive component to render the treeview
    const renderDeviceTree = (deviceList, level = 0) => {
        return (
            <ul>
                {deviceList.map(device => (
                    <li key={device.id} className={`device-item level-${level}`}>
                        <div className="device-header">
                            {device.children && device.children.length > 0 && (
                                <span
                                    className={`expand-toggle ${expandedDevices[device.id] ? 'expanded' : ''}`}
                                    onClick={() => toggleExpand(device.id)}
                                >
                                    {expandedDevices[device.id] ? '▼' : '►'}
                                </span>
                            )}
                            <span className={`status-dot ${device.isOnline ? 'online' : 'offline'}`} title={device.isOnline ? 'Online' : 'Offline'}></span>
                            <span className="device-name">{device.name}</span>
                            <span className="device-ip">{device.ipAddress}</span>
                            <span className="device-latency">
                                Latency: {device.lastLatency !== null ? `${device.lastLatency}ms` : 'N/A'}
                            </span>
                            <div className="latency-sparkline">
                                {device.pingResults && device.pingResults.length > 0 && (
                                    <Sparklines data={device.pingResults.map(p => p.latency || 0).reverse()} limit={20} width={100} height={20} margin={5}>
                                        <SparklinesLine color={device.isOnline ? "green" : "red"} style={{ strokeWidth: 1.5 }} />
                                        <SparklinesSpots size={2.5} style={{ strokeWidth: 1.5, stroke: device.isOnline ? "green" : "red", fill: "white" }} />
                                    </Sparklines>
                                )}
                                {(!device.pingResults || device.pingResults.length === 0) && (
                                    <span className="no-data">No ping history</span>
                                )}
                            </div>
                        </div>
                        {device.children && device.children.length > 0 && expandedDevices[device.id] && (
                            renderDeviceTree(device.children, level + 1)
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="dashboard-container">
            <h2>Network Device Dashboard</h2>
            <button onClick={handleRefresh} disabled={loading}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>

            {error && <div className="error-message">{error}</div>}

            {loading && devices.length === 0 && <div className="loading-message">Loading devices...</div>}

            {!loading && devices.length === 0 && !error && (
                <div className="no-data-message">No devices found.</div>
            )}

            {devices.length > 0 && (
                <div className="device-treeview">
                    {renderDeviceTree(devices)}
                </div>
            )}
        </div>
    );
}

export default Dashboard;