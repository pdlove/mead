import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const AddEditUserModal = ({ user, allClusters, allWebsites, onClose }) => {
    const { userId, setMessage, API_BASE_URL } = useContext(AppContext);
    const [targetUserId, setTargetUserId] = useState(user ? user.id : '');
    const [role, setRole] = useState(user ? user.role : 'website_admin');
    const [assignedClusters, setAssignedClusters] = useState(user?.assignedClusters || []);
    const [assignedWebsites, setAssignedWebsites] = useState(user?.assignedWebsites || []);

    const handleClusterToggle = (clusterId) => {
        setAssignedClusters(prev =>
            prev.includes(clusterId)
                ? prev.filter(id => id !== clusterId)
                : [...prev, clusterId]
        );
    };

    const handleWebsiteToggle = (websiteId) => {
        setAssignedWebsites(prev =>
            prev.includes(websiteId)
                ? prev.filter(id => id !== websiteId)
                : [...prev, websiteId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('User not authenticated.');
            return;
        }

        const userData = { role };

        if (role === 'cluster_admin') {
            userData.assignedClusters = assignedClusters;
            userData.assignedWebsites = [];
        } else if (role === 'website_admin') {
            userData.assignedWebsites = assignedWebsites;
            userData.assignedClusters = [];
        } else { // site_admin
            userData.assignedClusters = [];
            userData.assignedWebsites = [];
        }

        try {
            // In a real app, you would send this to your backend's user management API
            const response = await fetch(`${API_BASE_URL}/users/${targetUserId}`, {
                method: 'PUT', // or POST if creating, PUT if updating
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setMessage(`User ${targetUserId} role updated successfully! (Backend simulation)`);
            onClose();
        } catch (error) {
            console.error("Error saving user role:", error);
            setMessage(`Error saving user role: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{user ? 'Edit User Role' : 'Add New User'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="targetUserId" className="block text-gray-700 text-sm font-bold mb-2">User ID:</label>
                        <input
                            type="text"
                            id="targetUserId"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={targetUserId}
                            onChange={(e) => setTargetUserId(e.target.value)}
                            required
                            readOnly={!!user}
                            placeholder="Enter User ID (e.g., from your auth system)"
                        />
                        {!user && (
                            <p className="text-xs text-gray-500 mt-1">
                                This should be an existing User ID from your backend's authentication system.
                            </p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                        <select
                            id="role"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="site_admin">Site Admin</option>
                            <option value="cluster_admin">Cluster Admin</option>
                            <option value="website_admin">Website Admin</option>
                        </select>
                    </div>

                    {role === 'cluster_admin' && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Assign Clusters:</label>
                            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                                {allClusters.length === 0 ? (
                                    <p className="text-gray-600 italic">No clusters available.</p>
                                ) : (
                                    allClusters.map(cluster => (
                                        <div key={cluster.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`assign-cluster-${cluster.id}`}
                                                checked={assignedClusters.includes(cluster.id)}
                                                onChange={() => handleClusterToggle(cluster.id)}
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                            />
                                            <label htmlFor={`assign-cluster-${cluster.id}`} className="ml-2 text-gray-800">
                                                {cluster.name} ({cluster.sharedIp})
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {role === 'website_admin' && (
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Assign Websites:</label>
                            <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                                {allWebsites.length === 0 ? (
                                    <p className="text-gray-600 italic">No websites available.</p>
                                ) : (
                                    allWebsites.map(website => (
                                        <div key={website.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`assign-website-${website.id}`}
                                                checked={assignedWebsites.includes(website.id)}
                                                onChange={() => handleWebsiteToggle(website.id)}
                                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                            />
                                            <label htmlFor={`assign-website-${website.id}`} className="ml-2 text-gray-800">
                                                {website.domain} ({website.type})
                                            </label>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-sm transition duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                        >
                            {user ? 'Update User' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditUserModal;