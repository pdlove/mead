// src/components/DeviceForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

// Helper to prevent circular relationships in parent selection
const isDescendant = (potentialDescendantId, ancestorId, devicesList) => {
    let current = potentialDescendantId;
    while (current) {
        const device = devicesList.find(d => d.id === current);
        if (!device) return false;
        // If current device is the ancestor, it's not a descendant of ancestor.
        // This handles cases where an ancestor is the device itself being edited.
        if (device.id === ancestorId) return false;
        if (device.parentId === ancestorId) return true;
        current = device.parentId;
    }
    return false;
};

const DeviceForm = ({ isOpen, onClose, onSubmit, initialData, categories, allDevices }) => {
    const [formData, setFormData] = useState({
        name: '',
        ipAddress: '',
        categoryId: '',
        parentId: null,
        description: '', // This field maps to 'connectionNotes' in your DB
        notifyEnabled: true,
        model: '',
        type: '',
        macAddress: '',
        isDHCP: false,
    });
    const [formErrors, setFormErrors] = useState({});

    // Filter devices for parent dropdown
    const availableParents = useMemo(() => {
        if (!allDevices) return [];
        return allDevices.filter(d =>
            d.id !== initialData?.id && // Exclude the device itself (if editing)
            !isDescendant(d.id, initialData?.id, allDevices) // Exclude its descendants
        );
    }, [allDevices, initialData]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                ipAddress: initialData.ipAddress || '',
                categoryId: initialData.categoryId || '',
                parentId: initialData.parentId || null,
                description: initialData.description || '',
                notifyEnabled: initialData.notifyEnabled ?? true,
                model: initialData.model || '',
                type: initialData.type || '',
                macAddress: initialData.macAddress || '',
                isDHCP: initialData.isDHCP ?? false,
            });
        } else {
            // Reset for new device
            setFormData({
                name: '',
                ipAddress: '',
                categoryId: '',
                parentId: null,
                description: '',
                notifyEnabled: true,
                model: '',
                type: '',
                macAddress: '',
                isDHCP: false,
            });
        }
        setFormErrors({}); // Clear errors on modal open/data change
    }, [isOpen, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Name is required.';
        if (!formData.ipAddress.trim()) errors.ipAddress = 'IP Address is required.';
        if (!formData.categoryId) errors.categoryId = 'Category is required.';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Convert empty strings for optional fields to null for backend
            const dataToSend = {
                ...formData,
                parentId: formData.parentId === '' ? null : formData.parentId,
                description: formData.description === '' ? null : formData.description,
                model: formData.model === '' ? null : formData.model,
                type: formData.type === '' ? null : formData.type,
                macAddress: formData.macAddress === '' ? null : formData.macAddress,
            };
            onSubmit(dataToSend);
        }
    };

    const customModalStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '600px',
            width: '90%',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
        },
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={customModalStyles}
            contentLabel={initialData ? "Edit Device" : "Add New Device"}
        >
            <h2 className="text-xl font-bold mb-4">{initialData ? "Edit Device" : "Add New Device"}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                    </div>

                    {/* IP Address */}
                    <div>
                        <label htmlFor="ipAddress" className="block text-sm font-medium text-gray-700">IP Address</label>
                        <input
                            type="text"
                            id="ipAddress"
                            name="ipAddress"
                            value={formData.ipAddress}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {formErrors.ipAddress && <p className="mt-1 text-sm text-red-600">{formErrors.ipAddress}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">Category</label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {formErrors.categoryId && <p className="mt-1 text-sm text-red-600">{formErrors.categoryId}</p>}
                    </div>

                    {/* Parent Device */}
                    <div>
                        <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">Parent Device (Optional)</label>
                        <select
                            id="parentId"
                            name="parentId"
                            value={formData.parentId || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                            <option value="">None (Top Level)</option>
                            {availableParents.map(deviceOption => (
                                <option key={deviceOption.id} value={deviceOption.id}>
                                    {deviceOption.name} ({deviceOption.ipAddress})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* New Field: Model */}
                    <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model</label>
                        <input
                            type="text"
                            id="model"
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* New Field: Type */}
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
                        <input
                            type="text"
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* New Field: MAC Address */}
                    <div>
                        <label htmlFor="macAddress" className="block text-sm font-medium text-gray-700">MAC Address</label>
                        <input
                            type="text"
                            id="macAddress"
                            name="macAddress"
                            value={formData.macAddress}
                            onChange={handleChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>

                    {/* New Field: isDHCP */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isDHCP"
                            name="isDHCP"
                            checked={formData.isDHCP}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isDHCP" className="ml-2 block text-sm text-gray-900">Is DHCP?</label>
                    </div>

                    {/* Connection Notes (mapped from description) */}
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Connection Notes</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        ></textarea>
                    </div>

                    {/* Notify Enabled */}
                    <div className="flex items-center md:col-span-2">
                        <input
                            type="checkbox"
                            id="notifyEnabled"
                            name="notifyEnabled"
                            checked={formData.notifyEnabled}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifyEnabled" className="ml-2 block text-sm text-gray-900">Enable Notifications</label>
                    </div>

                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {initialData ? "Save Changes" : "Add Device"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default DeviceForm;