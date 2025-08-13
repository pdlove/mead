import React, { useState, useContext } from 'react';
import { AppContext } from '../../../src/frontend/public/AppContext';

const AddEditServerModal = ({ server, onClose }) => {
    const { userId, setMessage, API_BASE_URL } = useContext(AppContext);
    const [name, setName] = useState(server ? server.name : '');
    const [ip, setIp] = useState(server ? server.ip : '');
    const [role, setRole] = useState(server ? server.role : 'nginx');
    const [sshUser, setSshUser] = useState(server ? server.sshUser : 'root');
    const [sshKey, setSshKey] = useState(server ? server.sshKey : '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('User not authenticated.');
            return;
        }

        const serverData = { name, ip, role, sshUser, sshKey };

        try {
            let response;
            if (server) {
                response = await fetch(`${API_BASE_URL}/servers/${server.id}`, {
                    method: 'PUT', // or PATCH
                    headers: { 'Content-Type': 'application/json', "X-Acting-User-Id": userId },
                    body: JSON.stringify(serverData),
                });
                setMessage('Server updated successfully!');
            } else {
                response = await fetch(`${API_BASE_URL}/servers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', "X-Acting-User-Id": userId },
                    body: JSON.stringify(serverData),
                });
                setMessage('Server added successfully!');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            onClose();
        } catch (error) {
            console.error("Error saving server:", error);
            setMessage(`Error saving server: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{server ? 'Edit Server' : 'Add New Server'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Server Name:</label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="ip" className="block text-gray-700 text-sm font-bold mb-2">IP Address:</label>
                        <input
                            type="text"
                            id="ip"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={ip}
                            onChange={(e) => setIp(e.target.value)}
                            required
                        />
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
                            <option value="nginx">Nginx</option>
                            <option value="haproxy">HAProxy</option>
                            <option value="both">Both (Nginx & HAProxy)</option>
                            <option value="redis">Redis</option>
                            <option value="mysql">MySQL Database</option>
                            <option value="postgresql">PostgreSQL Database</option>
                            <option value="mssql">MS SQL Database</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="sshUser" className="block text-gray-700 text-sm font-bold mb-2">SSH Username:</label>
                        <input
                            type="text"
                            id="sshUser"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sshUser}
                            onChange={(e) => setSshUser(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="sshKey" className="block text-gray-700 text-sm font-bold mb-2">SSH Private Key (for backend use - not stored securely here):</label>
                        <textarea
                            id="sshKey"
                            rows = "5"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sshKey}
                            onChange={(e) => setSshKey(e.target.value)}
                            placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                        ></textarea>
                        <p className="text-xs text-gray-500 mt-1">
                            In a real application, this key would be managed securely on the backend, not stored in the frontend or directly in the database.
                        </p>
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
                            {server ? 'Update Server' : 'Add Server'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditServerModal;