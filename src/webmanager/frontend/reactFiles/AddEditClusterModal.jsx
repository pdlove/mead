import React, { useState, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const AddEditClusterModal = ({ cluster, allServers, onClose }) => {
    const { userId, setMessage, API_BASE_URL } = useContext(AppContext);
    const [name, setName] = useState(cluster ? cluster.name : '');
    const [sharedIp, setSharedIp] = useState(cluster ? cluster.sharedIp : '');
    const [selectedServerIds, setSelectedServerIds] = useState(cluster ? cluster.serverIds : []);

    const handleServerToggle = (serverId) => {
        setSelectedServerIds(prev =>
            prev.includes(serverId)
                ? prev.filter(id => id !== serverId)
                : [...prev, serverId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('User not authenticated.');
            return;
        }

        const clusterData = { name, sharedIp, serverIds: selectedServerIds };

        try {
            let response;
            if (cluster) {
                response = await fetch(`${API_BASE_URL}/clusters/${cluster.id}`, {
                    method: 'PUT', // or PATCH
                    headers: { 'Content-Type': 'application/json', "X-Acting-User-Id": userId },
                    body: JSON.stringify(clusterData),
                });
                setMessage('Cluster updated successfully!');
            } else {
                response = await fetch(`${API_BASE_URL}/clusters`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', "X-Acting-User-Id": userId },
                    body: JSON.stringify(clusterData),                
                });
                setMessage('Cluster added successfully!');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            onClose();
        } catch (error) {
            console.error("Error saving cluster:", error);
            setMessage(`Error saving cluster: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{cluster ? 'Edit Cluster' : 'Create New Cluster'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="clusterName" className="block text-gray-700 text-sm font-bold mb-2">Cluster Name:</label>
                        <input
                            type="text"
                            id="clusterName"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sharedIp" className="block text-gray-700 text-sm font-bold mb-2">Shared IP Address (for the cluster):</label>
                        <input
                            type="text"
                            id="sharedIp"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sharedIp}
                            onChange={(e) => setSharedIp(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            This IP would typically be managed by a virtual IP solution (e.g., VRRP/Keepalived) or a load balancer.
                        </p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Select Member Servers:</label>
                        <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                            {allServers.length === 0 ? (
                                <p className="text-gray-600 italic">No servers available. Add servers first.</p>
                            ) : (
                                allServers.map(server => (
                                    <div key={server.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`server-${server.id}`}
                                            checked={selectedServerIds.includes(server.id)}
                                            onChange={() => handleServerToggle(server.id)}
                                            className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                        />
                                        <label htmlFor={`server-${server.id}`} className="ml-2 text-gray-800">
                                            {server.name} ({server.ip} - {server.role})
                                        </label>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
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
                            {cluster ? 'Update Cluster' : 'Create Cluster'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditClusterModal;
