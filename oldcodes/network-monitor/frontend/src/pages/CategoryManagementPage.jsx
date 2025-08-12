// src/pages/CategoryManagementPage.jsx
import React, { useState, useEffect } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/apiService';
import './CategoryManagementPage.css'; // Import the CSS file

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // State for the form (used for both adding and editing)
    const [formData, setFormData] = useState({
        id: null, // Will be set only when editing an existing category
        name: '',
        notifyDownPolls: 0, // Number field, default to 0
        notifyUpPolls: 0,   // Number field, default to 0
        pollInterval: 60,   // Number field, default to 60 seconds
    });

    // --- Fetch Categories ---
    const fetchCategories = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error("Failed to fetch categories:", err);
            setError(err.message || 'Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- Form Handlers ---
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prevData => ({
            ...prevData,
            // Convert number fields to integers
            [name]: type === 'number' ? parseInt(value, 10) : value,
        }));
        setError(null); // Clear errors on input change
        setSuccessMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        // Basic validation
        if (!formData.name.trim()) {
            setError('Category name cannot be empty.');
            return;
        }
        if (isNaN(formData.notifyDownPolls) || formData.notifyDownPolls < 0) {
             setError('Notify Down Polls must be a non-negative number.');
             return;
        }
        if (isNaN(formData.notifyUpPolls) || formData.notifyUpPolls < 0) {
             setError('Notify Up Polls must be a non-negative number.');
             return;
        }
        if (isNaN(formData.pollInterval) || formData.pollInterval <= 0) {
             setError('Poll Interval must be a positive number.');
             return;
        }

        setLoading(true);
        try {
            // Prepare data for API call, ensuring numbers are numbers
            const categoryData = {
                name: formData.name.trim(),
                notifyDownPolls: formData.notifyDownPolls,
                notifyUpPolls: formData.notifyUpPolls,
                pollInterval: formData.pollInterval,
            };

            if (formData.id) {
                // Update existing category
                await updateCategory(formData.id, categoryData);
                setSuccessMessage('Category updated successfully!');
            } else {
                // Add new category
                await createCategory(categoryData);
                setSuccessMessage('Category added successfully!');
            }
            resetForm(); // Clear form fields
            await fetchCategories(); // Re-fetch all categories to update the list
        } catch (err) {
            console.error("Failed to save category:", err);
            setError(err.message || 'Failed to save category.');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (category) => {
        // Populate the form with the category data for editing
        setFormData({
            id: category.id,
            name: category.name,
            notifyDownPolls: category.notifyDownPolls,
            notifyUpPolls: category.notifyUpPolls,
            pollInterval: category.pollInterval,
        });
        setError(null);
        setSuccessMessage('');
    };

    const resetForm = () => {
        setFormData({
            id: null,
            name: '',
            notifyDownPolls: 0,
            notifyUpPolls: 0,
            pollInterval: 60,
        });
        setError(null);
        setSuccessMessage('');
    };

    // --- Delete Category ---
    const handleDeleteCategory = async (id) => {
        if (!window.confirm('Are you sure you want to delete this category? This cannot be undone.')) {
            return;
        }
        setLoading(true);
        setError(null);
        setSuccessMessage('');
        try {
            await deleteCategory(id);
            setSuccessMessage('Category deleted successfully!');
            await fetchCategories(); // Re-fetch
            if (formData.id === id) { // If the deleted category was in edit mode, reset form
                resetForm();
            }
        } catch (err) {
            console.error("Failed to delete category:", err);
            setError(err.message || 'Failed to delete category. Ensure no devices are linked to it.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && categories.length === 0) {
        return <div className="category-container">Loading categories...</div>;
    }

    return (
        <div className="category-container">
            <h2 className="category-heading">Manage Device Categories</h2>

            {successMessage && <div className="success-message">{successMessage}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Add/Edit Category Form */}
            <div className="form-section">
                <h3>{formData.id ? 'Edit Category' : 'Add New Category'}</h3>
                <form onSubmit={handleSubmit} className="category-form-grid">
                    <div className="category-form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="category-input"
                            disabled={loading}
                        />
                    </div>

                    <div className="category-form-group">
                        <label htmlFor="notifyDownPolls">Notify Down Polls:</label>
                        <input
                            type="number"
                            id="notifyDownPolls"
                            name="notifyDownPolls"
                            value={formData.notifyDownPolls}
                            onChange={handleChange}
                            required
                            className="category-input"
                            disabled={loading}
                            min="0"
                        />
                    </div>

                    <div className="category-form-group">
                        <label htmlFor="notifyUpPolls">Notify Up Polls:</label>
                        <input
                            type="number"
                            id="notifyUpPolls"
                            name="notifyUpPolls"
                            value={formData.notifyUpPolls}
                            onChange={handleChange}
                            required
                            className="category-input"
                            disabled={loading}
                            min="0"
                        />
                    </div>

                    <div className="category-form-group">
                        <label htmlFor="pollInterval">Poll Interval (seconds):</label>
                        <input
                            type="number"
                            id="pollInterval"
                            name="pollInterval"
                            value={formData.pollInterval}
                            onChange={handleChange}
                            required
                            className="category-input"
                            disabled={loading}
                            min="1"
                        />
                    </div>

                    <div className="category-form-actions">
                        <button type="submit" disabled={loading} className="category-button">
                            {loading ? 'Processing...' : (formData.id ? 'Update Category' : 'Add Category')}
                        </button>
                        {formData.id && (
                            <button type="button" onClick={resetForm} disabled={loading} className="category-button cancel-button">
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Categories List Table */}
            <div className="list-section">
                <h3>Existing Categories</h3>
                {categories.length === 0 && !loading ? (
                    <p>No categories found. Add one above!</p>
                ) : (
                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Notify Down Polls</th>
                                <th>Notify Up Polls</th>
                                <th>Poll Interval (s)</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((category) => (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>{category.notifyDownPolls}</td>
                                    <td>{category.notifyUpPolls}</td>
                                    <td>{category.pollInterval}</td>
                                    <td>
                                        <button onClick={() => handleEditClick(category)} disabled={loading} className="action-button edit-button">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDeleteCategory(category.id)} disabled={loading} className="action-button delete-button">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CategoryManagementPage;