// src/pages/DeviceManagementPage.jsx
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'; // Added useRef
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faChevronRight, faChevronDown, faUpload } from '@fortawesome/free-solid-svg-icons'; // Added faUpload
import DeviceForm from '../components/DeviceForm';
import ConfirmationModal from '../components/ConfirmationModal';
import Papa from 'papaparse'; // Import PapaParse
import './DeviceManagementPage.css'; // Import the CSS file for styling

// Define API Base URL from environment variable (for Vite projects)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const DeviceManagementPage = () => {
    // State for the flat list of all devices fetched from the API
    const [devices, setDevices] = useState([]);
    // State for the list of categories, used in dropdowns
    const [categories, setCategories] = useState([]);
    // Loading indicator for data fetching
    const [loading, setLoading] = useState(true);
    // Error message display
    const [error, setError] = useState(null);
    // Success message for general operations (like import)
    const [successMessage, setSuccessMessage] = useState(null);

    // State for controlling the add/edit device modal
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    // State to hold the device data when editing (null for adding new)
    const [currentDevice, setCurrentDevice] = useState(null);

    // State for controlling the delete confirmation modal
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    // State to hold the device object to be deleted
    const [deviceToDelete, setDeviceToDelete] = useState(null);

    // State to manage which device branches are expanded in the tree view
    // Using an object/map for O(1) lookup of expansion status
    const [expandedDevices, setExpandedDevices] = useState({});

    // State for CSV import
    const [csvFile, setCsvFile] = useState(null);
    const fileInputRef = useRef(null); // Ref for file input element

    // Memoize a map for quick device lookup by ID (useful for tree building and ancestor finding)
    // This map ensures that when we trace parent IDs, we have quick access to device objects
    const allDevicesMap = useMemo(() => {
        return new Map(devices.map(device => [device.id, device]));
    }, [devices]);

    // Helper function to get all ancestor IDs for a given device
    // This is used for auto-expanding the path to a newly added child device
    const getAncestors = useCallback((deviceId, map) => {
        let currentId = deviceId;
        const ancestors = new Set();
        while (currentId) {
            // Add the current device itself to ancestors set for expansion
            ancestors.add(currentId);
            const device = map.get(currentId);
            // If there's no device or no parent, we've reached the root or an invalid link
            if (!device || !device.parentId) {
                break;
            }
            currentId = device.parentId; // Move up to the parent
        }
        return Array.from(ancestors); // Convert set to array
    }, []);


    // --- Data Fetching Logic ---
    // Fetches all devices and categories from the backend
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null); // Clear success message on new fetch
        try {
            const [devicesRes, categoriesRes] = await Promise.all([
                axios.get(`${API_BASE_URL}/devices`),
                axios.get(`${API_BASE_URL}/categories`),
            ]);

            // Backend is sending 'parentID' (uppercase D), Frontend expects 'parentId' (lowercase d)
            // Transform the incoming devices data to match frontend's expected 'parentId'
            const transformedDevicesData = devicesRes.data.map(device => ({
                ...device,
                // If backend sends 'parentID', use it, otherwise assume 'parentId' is already correct
                parentId: device.parentID !== undefined ? device.parentID : device.parentId
            }));

            setDevices(transformedDevicesData);
            setCategories(categoriesRes.data);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            // Provide a more user-friendly error message
            setError(err.response?.data?.message || "Failed to load devices or categories. Please check backend connection and server logs.");
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array means this function is created once on mount

    // Effect hook to call fetchData when the component mounts
    useEffect(() => {
        fetchData();
    }, [fetchData]); // Dependency on fetchData ensures it runs when fetchData itself is stable

    // --- Tree View Building Logic ---
    // Memoized function to build the hierarchical tree structure from the flat 'devices' array
    const buildDeviceTree = useCallback((flatDevices, parentId = null) => {
        const tree = [];
        // Filter for devices that match the current parentId (null for root devices)
        flatDevices
            .filter(device => device.parentId === parentId)
            .sort((a, b) => a.name.localeCompare(b.name)) // Sort devices by name for consistent order
            .forEach(device => {
                const deviceWithRelations = {
                    ...device,
                    // Ensure category object is always present for consistent display, even if backend fails to include
                    category: device.category || { id: '', name: 'N/A' },
                    parent: device.parent || null, // Ensure parent object is null if not present
                };
                // Recursively call buildDeviceTree to find children for the current device
                deviceWithRelations.children = buildDeviceTree(flatDevices, device.id);
                tree.push(deviceWithRelations);
            });
        return tree;
    }, []); // No external dependencies, just re-creates if categories (used in device object within tree) changes (though not directly here)

    // Memoized array representing the top-level of the device tree
    // Re-calculates only when 'devices' or 'buildDeviceTree' (which is stable) changes
    const deviceTree = useMemo(() => buildDeviceTree(devices), [devices, buildDeviceTree]);

    // --- CRUD Operations ---

    // Handles adding a new device or updating an existing one
    const handleAddEditDevice = async (formData) => {
        try {
            let response;
            if (currentDevice) {
                // If currentDevice is set, it's an edit operation
                response = await axios.put(`${API_BASE_URL}/devices/${currentDevice.id}`, formData);
            } else {
                // Otherwise, it's an add new device operation
                response = await axios.post(`${API_BASE_URL}/devices`, formData);

                // Auto-expand the path to the newly added device
                const newDeviceId = response.data.id;
                // Get all ancestors of the new device (including itself)
                const ancestorsToExpand = getAncestors(newDeviceId, allDevicesMap);
                setExpandedDevices(prev => {
                    const newExpanded = { ...prev };
                    // Set all ancestors (and the new device) to expanded
                    ancestorsToExpand.forEach(id => newExpanded[id] = true);
                    return newExpanded;
                });
            }
            await fetchData(); // Re-fetch all data to update the table with the latest state
            setIsFormModalOpen(false); // Close the form modal
            setCurrentDevice(null); // Reset current device being edited
            setSuccessMessage(`Device "${response.data.name}" saved successfully.`);
        } catch (err) {
            console.error("Failed to save device:", err);
            setError(err.response?.data?.message || "Failed to save device. Please check your input and try again.");
        }
    };

    // Handles deleting a device
    const handleDeleteDevice = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/devices/${id}`);
            await fetchData(); // Re-fetch data to reflect the deletion
            setIsConfirmModalOpen(false); // Close confirmation modal
            setDeviceToDelete(null); // Reset device to delete
            setSuccessMessage("Device deleted successfully.");
        } catch (err) {
            console.error("Failed to delete device:", err);
            setError(err.response?.data?.message || "Failed to delete device. Check server logs for details.");
        }
    };

    // --- CSV Import Functions ---

    // Handles selection of CSV file
    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setCsvFile(event.target.files[0]);
            setError(null); // Clear previous errors
            setSuccessMessage(null); // Clear previous success messages
        } else {
            setCsvFile(null);
        }
    };

    // Triggers the hidden file input
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    // Handles the CSV upload process
    const handleCsvUpload = () => {
        if (!csvFile) {
            setError("Please select a CSV file first.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        Papa.parse(csvFile, {
            header: true, // Treat the first row as headers
            skipEmptyLines: true,
            complete: async (results) => {
                const parsedData = results.data;
                console.log("Parsed CSV Data:", parsedData);

                // Map CSV headers to backend expected fields
                // CSV headers: IP Address, Name, Type, Category, Model, Parent IP, Connection Notes
                // Backend fields: ipAddress, name, type, categoryName, model, parentIP, description
                const devicesToImport = parsedData.map(row => ({
                    ipAddress: row['IP Address']?.trim(),
                    name: row['Name']?.trim(),
                    type: row['Type']?.trim() || null, // Optional
                    categoryName: row['Category']?.trim(), // Will be mapped to categoryId on backend
                    model: row['Model']?.trim() || null, // Optional
                    parentIP: row['Parent IP']?.trim() || null, // Will be mapped to parentId on backend
                    description: row['Connection Notes']?.trim() || null, // Maps to 'connectionNotes' in DB
                }));

                try {
                    // Send the processed data to a new backend import endpoint
                    const response = await axios.post(`${API_BASE_URL}/devices/import`, devicesToImport);
                    setSuccessMessage(response.data.message || "CSV imported successfully!");
                    await fetchData(); // Refresh data after import
                } catch (err) {
                    console.error("CSV Import Error:", err);
                    setError(err.response?.data?.message || "Failed to import CSV. Please check the file format and try again.");
                } finally {
                    setLoading(false);
                    setCsvFile(null); // Clear the selected file
                    if (fileInputRef.current) {
                        fileInputRef.current.value = ""; // Reset file input
                    }
                }
            },
            error: (err) => {
                console.error("PapaParse Error:", err);
                setLoading(false);
                setError(`Failed to parse CSV: ${err.message}`);
                setCsvFile(null); // Clear the selected file
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""; // Reset file input
                }
            }
        });
    };


    // --- Modal Control Functions ---
    const openAddModal = () => {
        setCurrentDevice(null); // No device selected means "Add New"
        setIsFormModalOpen(true);
        setError(null); // Clear errors
        setSuccessMessage(null); // Clear success message
    };

    const openEditModal = (device) => {
        setCurrentDevice(device); // Set the device to be edited
        setIsFormModalOpen(true);
        setError(null); // Clear errors
        setSuccessMessage(null); // Clear success message
    };

    const openConfirmDeleteModal = (device) => {
        setDeviceToDelete(device); // Set the device for confirmation
        setIsConfirmModalOpen(true);
        setError(null); // Clear errors
        setSuccessMessage(null); // Clear success message
    };

    // --- Tree Expansion/Collapse ---
    const toggleExpand = useCallback((deviceId) => {
        setExpandedDevices(prev => ({
            ...prev,
            [deviceId]: !prev[deviceId] // Toggle the expanded status for the given device ID
        }));
    }, []);

    // --- Recursive Device Tree Row Component ---
    // This component is defined inside DeviceManagementPage to easily access
    // expandedDevices and toggleExpand state/functions without prop drilling.
    const DeviceTreeRow = useCallback(({ device, level = 0 }) => {
        const isExpanded = expandedDevices[device.id]; // Check if this device's children should be visible
        const hasChildren = device.children && device.children.length > 0;

        return (
            <>
                <tr className={level % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {/* Name Column with Indentation and Expand/Collapse Toggle */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ paddingLeft: `${20 + level * 20}px`, minWidth: '220px' }}>
                        <div className="flex items-center">
                            {hasChildren ? (
                                <FontAwesomeIcon
                                    icon={isExpanded ? faChevronDown : faChevronRight}
                                    className="mr-2 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() => toggleExpand(device.id)}
                                />
                            ) : (
                                // Spacer for alignment if no children/toggle
                                <span className="w-4 h-4 inline-block mr-2"></span>
                            )}
                            {device.name}
                        </div>
                    </td>
                    {/* Type Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.type || 'N/A'}</td>
                    {/* IP Address Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.ipAddress || 'N/A'}</td>
                    {/* Category Column (displaying category name) */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{device.category?.name || 'N/A'}</td>
                    {/* Actions Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                            onClick={() => openEditModal(device)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                            <FontAwesomeIcon icon={faEdit} className="mr-1" />
                            Edit
                        </button>
                        <button
                            onClick={() => openConfirmDeleteModal(device)}
                            className="text-red-600 hover:text-red-900"
                        >
                            <FontAwesomeIcon icon={faTrash} className="mr-1" />
                            Delete
                        </button>
                    </td>
                </tr>
                {/* Recursively render children if expanded and they exist */}
                {isExpanded && hasChildren && device.children.map(child => (
                    <DeviceTreeRow key={child.id} device={child} level={level + 1} />
                ))}
            </>
        );
    }, [expandedDevices, toggleExpand, openEditModal, openConfirmDeleteModal]);


    // --- Render Logic ---
    if (loading) return <div className="text-center py-8">Loading devices...</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Device Management</h1>

            {/* Error and Success Messages */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                        <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline"> {successMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMessage(null)}>
                        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.103l-2.651 3.746a1.2 1.2 0 0 1-1.697-1.697l3.746-2.651-3.746-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.897l2.651-3.746a1.2 1.2 0 0 1 1.697 1.697L11.103 10l3.746 2.651a1.2 1.2 0 0 1 0 1.698z"/></svg>
                    </span>
                </div>
            )}


            {/* Action Buttons: Add Device and CSV Import */}
            <div className="mb-4 flex justify-between items-center">
                {/* CSV Import Section */}
                <div className="flex items-center space-x-2">
                    <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Hide the actual file input
                    />
                    <button
                        onClick={triggerFileInput}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        {csvFile ? csvFile.name : "Choose CSV File"}
                    </button>
                    {csvFile && (
                        <button
                            onClick={handleCsvUpload}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                            disabled={loading}
                        >
                            {loading ? "Importing..." : "Import CSV"}
                        </button>
                    )}
                </div>

                {/* Add New Device Button */}
                <button
                    onClick={openAddModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Add New Device
                </button>
            </div>


            {/* Device Table */}
            {devices.length === 0 && !loading ? (
                <p className="text-center text-gray-500">No devices found. Add one or import from CSV!</p>
            ) : (
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    style={{ minWidth: '220px' }} // Wide enough for Name (including indentation)
                                >
                                    Name
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Type
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    IP Address
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Category
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Render top-level devices using the recursive component */}
                            {deviceTree.map(device => (
                                <DeviceTreeRow key={device.id} device={device} level={0} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Device Modal */}
            <DeviceForm
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleAddEditDevice}
                initialData={currentDevice}
                categories={categories}
                allDevices={devices} // Pass all devices for parent dropdown logic in form
            />

            {/* Confirmation Modal for Delete */}
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => handleDeleteDevice(deviceToDelete.id)}
                title="Confirm Deletion"
                message={`Are you sure you want to delete "${deviceToDelete?.name}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default DeviceManagementPage;