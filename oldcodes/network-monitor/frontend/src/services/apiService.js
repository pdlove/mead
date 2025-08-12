// src/services/apiService.js (Updated)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Something went wrong';
        try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
            errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

// --- Email Settings API Functions (Existing) ---
export const getEmailSettings = async () => {
    const response = await fetch(`${API_BASE_URL}/email-settings`);
    return handleResponse(response);
};

export const saveEmailSettings = async (settings) => {
    const response = await fetch(`${API_BASE_URL}/email-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
    });
    return handleResponse(response);
};

// --- Device Category API Functions (Existing) ---
export const getCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    return handleResponse(response);
};

export const createCategory = async (categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
};

export const updateCategory = async (id, categoryData) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
    });
    return handleResponse(response);
};

export const deleteCategory = async (id) => {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};

// --- NEW: Device Management API Functions ---

/**
 * Fetches all devices from the backend.
 * Assumes backend can include related 'category' and 'parent' objects.
 * @returns {Promise<Array>} An array of device objects.
 */
export const getDevices = async () => {
    const response = await fetch(`${API_BASE_URL}/devices`); // Might need /devices?includeCategory=true&includeParent=true depending on backend
    return handleResponse(response);
};

/**
 * Creates a new device.
 * @param {Object} deviceData - The device data.
 * @returns {Promise<Object>} The created device object.
 */
export const createDevice = async (deviceData) => {
    const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData),
    });
    return handleResponse(response);
};

/**
 * Updates an existing device.
 * @param {string} id - The ID of the device to update.
 * @param {Object} deviceData - The updated device data.
 * @returns {Promise<Object>} The updated device object.
 */
export const updateDevice = async (id, deviceData) => {
    const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deviceData),
    });
    return handleResponse(response);
};

/**
 * Deletes a device.
 * @param {string} id - The ID of the device to delete.
 * @returns {Promise<void>}
 */
export const deleteDevice = async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};