import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

const AddEditWebsiteModal = ({ website, clusters, onClose }) => {
    const { userId, setMessage, API_BASE_URL } = useContext(AppContext);
    const [domain, setDomain] = useState(website ? website.domain : '');
    const [type, setType] = useState(website ? website.type : 'static');
    const [docRoot, setDocRoot] = useState(website ? website.docRoot : '');
    const [clusterId, setClusterId] = useState(website ? website.clusterId : (clusters.length > 0 ? clusters[0].id : ''));
    const [port, setPort] = useState(website ? website.port : '');

    const [phpTemplate, setPhpTemplate] = useState(website?.phpTemplate || 'default');
    const [phpVersion, setPhpVersion] = useState(website?.phpVersion || '8.1');
    const [phpModules, setPhpModules] = useState(website?.phpModules || '');

    const [sslType, setSslType] = useState(website?.sslType || 'None');
    const [customSslCertPath, setCustomSslCertPath] = useState(website?.customSslCertPath || '/etc/nginx/ssl/cert.pem');
    const [customSslKeyPath, setCustomSslKeyPath] = useState(website?.customSslKeyPath || '/etc/nginx/ssl/key.pem');

    const [githubUrl, setGithubUrl] = useState(website?.githubUrl || '');
    const [githubUsername, setGithubUsername] = useState(website?.githubUsername || '');
    const [githubAuthType, setGithubAuthType] = useState(website?.githubAuthType || 'none');
    const [githubPassword, setGithubPassword] = useState('');
    const [githubSshCert, setGithubSshCert] = useState('');
    const [githubSshCertInstalledDate, setGithubSshCertInstalledDate] = useState(website?.githubSshCertInstalledDate || null);

    const [webhookEnabled, setWebhookEnabled] = useState(website?.webhookEnabled || false);
    const [webhookUrl, setWebhookUrl] = useState(website?.webhookUrl || '');
    const [webhookSecret, setWebhookSecret] = useState(website?.webhookSecret || '');

    useEffect(() => {
        if (!website && domain && docRoot === '') {
            setDocRoot(`/var/www/${domain.replace(/\./g, '_')}`);
        } else if (website && website.docRoot) {
            setDocRoot(website.docRoot);
        }
    }, [domain, website, docRoot]);

    useEffect(() => {
        if (website?.githubSshCertInstalledDate) {
            setGithubSshCertInstalledDate(website.githubSshCertInstalledDate);
        }
    }, [website]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage('User not authenticated.');
            return;
        }

        const websiteData = {
            domain,
            type,
            docRoot,
            clusterId,
            sslType,
            githubUrl,
            githubUsername,
            githubAuthType,
            webhookEnabled,
            webhookUrl,
            webhookSecret,
        };

        if (type === 'node' || type === 'python') {
            websiteData.port = port;
        }

        if (type === 'php') {
            websiteData.phpTemplate = phpTemplate;
            if (phpTemplate === 'custom') {
                websiteData.phpVersion = phpVersion;
                websiteData.phpModules = phpModules;
            } else {
                if (phpTemplate === 'php_7_4_fpm') {
                    websiteData.phpVersion = '7.4';
                    websiteData.phpModules = 'fpm';
                } else if (phpTemplate === 'php_8_1_fpm_redis') {
                    websiteData.phpVersion = '8.1';
                    websiteData.phpModules = 'fpm, redis';
                }
            }
        }

        if (sslType === 'Custom') {
            websiteData.customSslCertPath = customSslCertPath;
            websiteData.customSslKeyPath = customSslKeyPath;
        }

        if (githubAuthType === 'password' && githubPassword) {
            websiteData.githubPassword = githubPassword;
        } else if (githubAuthType === 'ssh' && githubSshCert) {
            websiteData.githubSshCert = githubSshCert;
            websiteData.githubSshCertInstalledDate = new Date().toISOString();
        } else if (githubAuthType === 'ssh' && website?.githubSshCertInstalledDate && !githubSshCert) {
            websiteData.githubSshCert = website.githubSshCert;
            websiteData.githubSshCertInstalledDate = website.githubSshCertInstalledDate;
        }

        try {
            let response;
            if (website) {
                response = await fetch(`${API_BASE_URL}/websites/${website.id}`, {
                    method: 'PUT', // or PATCH
                    headers: { 'Content-Type': 'application/json', "X-Acting-User-Id": userId },
                    body: JSON.stringify(websiteData),
                });
                setMessage('Website updated successfully!');
            } else {
                response = await fetch(`${API_BASE_URL}/websites`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', "X-Acting-User-Id": userId },
                    body: JSON.stringify(websiteData),
                });
                setMessage('Website added successfully!');
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            onClose();
        } catch (error) {
            console.error("Error saving website:", error);
            setMessage(`Error saving website: ${error.message}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{website ? 'Edit Website' : 'Deploy New Website'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="domain" className="block text-gray-700 text-sm font-bold mb-2">Domain:</label>
                        <input
                            type="text"
                            id="domain"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">Website Type:</label>
                        <select
                            id="type"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            required
                        >
                            <option value="static">Static HTML</option>
                            <option value="node">Node.js</option>
                            <option value="python">Python (e.g., Flask/Django)</option>
                            <option value="php">PHP</option>
                        </select>
                    </div>

                    {type === 'php' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="phpTemplate" className="block text-gray-700 text-sm font-bold mb-2">PHP Template:</label>
                                <select
                                    id="phpTemplate"
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={phpTemplate}
                                    onChange={(e) => setPhpTemplate(e.target.value)}
                                >
                                    <option value="default">Default (PHP 8.1 FPM)</option>
                                    <option value="php_7_4_fpm">PHP 7.4 FPM</option>
                                    <option value="php_8_1_fpm_redis">PHP 8.1 FPM + Redis</option>
                                    <option value="custom">Custom</option>
                                </select>
                            </div>
                            {phpTemplate === 'custom' && (
                                <>
                                    <div className="mb-4">
                                        <label htmlFor="phpVersion" className="block text-gray-700 text-sm font-bold mb-2">PHP Version (e.g., 7.4, 8.1):</label>
                                        <input
                                            type="text"
                                            id="phpVersion"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={phpVersion}
                                            onChange={(e) => setPhpVersion(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="phpModules" className="block text-gray-700 text-sm font-bold mb-2">PHP Modules (comma-separated):</label>
                                        <input
                                            type="text"
                                            id="phpModules"
                                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={phpModules}
                                            onChange={(e) => setPhpModules(e.target.value)}
                                            placeholder="e.g., gd, curl, mbstring"
                                        />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    <div className="mb-4">
                        <label htmlFor="docRoot" className="block text-gray-700 text-sm font-bold mb-2">Document Root / App Path:</label>
                        <input
                            type="text"
                            id="docRoot"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={docRoot}
                            onChange={(e) => setDocRoot(e.target.value)}
                            required
                        />
                    </div>
                    {(type === 'node' || type === 'python') && (
                        <div className="mb-4">
                            <label htmlFor="port" className="block text-gray-700 text-sm font-bold mb-2">Application Port (e.g., 3000, 5000):</label>
                            <input
                                type="number"
                                id="port"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={port}
                                onChange={(e) => setPort(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label htmlFor="sslType" className="block text-gray-700 text-sm font-bold mb-2">SSL Configuration:</label>
                        <select
                            id="sslType"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={sslType}
                            onChange={(e) => setSslType(e.target.value)}
                            required
                        >
                            <option value="None">None</option>
                            <option value="Custom">Custom SSL Certificate</option>
                            <option value="Let's Encrypt">Let's Encrypt</option>
                        </select>
                    </div>

                    {sslType === 'Custom' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="customSslCertPath" className="block text-gray-700 text-sm font-bold mb-2">Certificate Path:</label>
                                <input
                                    type="text"
                                    id="customSslCertPath"
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={customSslCertPath}
                                    onChange={(e) => setCustomSslCertPath(e.target.value)}
                                    placeholder="/etc/nginx/ssl/your_domain.crt"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="customSslKeyPath" className="block text-gray-700 text-sm font-bold mb-2">Key Path:</label>
                                <input
                                    type="text"
                                    id="customSslKeyPath"
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={customSslKeyPath}
                                    onChange={(e) => setCustomSslKeyPath(e.target.value)}
                                    placeholder="/etc/nginx/ssl/your_domain.key"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <fieldset className="mb-6 p-4 border border-gray-300 rounded-lg">
                        <legend className="text-lg font-semibold text-gray-800 px-2">GitHub Repository</legend>
                        <div className="mb-4">
                            <label htmlFor="githubUrl" className="block text-gray-700 text-sm font-bold mb-2">Repository URL:</label>
                            <input
                                type="url"
                                id="githubUrl"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={githubUrl}
                                onChange={(e) => setGithubUrl(e.target.value)}
                                placeholder="e.g., https://github.com/user/repo.git"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="githubUsername" className="block text-gray-700 text-sm font-bold mb-2">GitHub Username:</label>
                            <input
                                type="text"
                                id="githubUsername"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={githubUsername}
                                onChange={(e) => setGithubUsername(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="githubAuthType" className="block text-gray-700 text-sm font-bold mb-2">Authentication Type:</label>
                            <select
                                id="githubAuthType"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={githubAuthType}
                                onChange={(e) => {
                                    setGithubAuthType(e.target.value);
                                    setGithubPassword('');
                                    setGithubSshCert('');
                                }}
                            >
                                <option value="none">None</option>
                                <option value="password">Password</option>
                                <option value="ssh">SSH Certificate</option>
                            </select>
                        </div>

                        {githubAuthType === 'password' && (
                            <div className="mb-4">
                                <label htmlFor="githubPassword" className="block text-gray-700 text-sm font-bold mb-2">GitHub Password/Token:</label>
                                <input
                                    type="password"
                                    id="githubPassword"
                                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={githubPassword}
                                    onChange={(e) => setGithubPassword(e.target.value)}
                                    placeholder="Enter GitHub password or Personal Access Token"
                                />
                                <p className="text-xs text-red-500 mt-1">
                                    Warning: Storing passwords directly in the frontend/database is insecure. Use a secure backend to handle credentials.
                                </p>
                            </div>
                        )}

                        {githubAuthType === 'ssh' && (
                            <div className="mb-4">
                                <label htmlFor="githubSshCert" className="block text-gray-700 text-sm font-bold mb-2">SSH Private Key:</label>
                                {githubSshCertInstalledDate && !githubSshCert ? (
                                    <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg border border-gray-200">
                                        <span className="text-gray-700">Installed on {new Date(githubSshCertInstalledDate).toLocaleDateString()}</span>
                                        <button
                                            type="button"
                                            onClick={() => setGithubSshCert('')}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-md text-sm transition duration-300"
                                        >
                                            Update SSH Cert
                                        </button>
                                    </div>
                                ) : (
                                    <textarea
                                        id="githubSshCert"
                                        rows="5"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={githubSshCert}
                                        onChange={(e) => setGithubSshCert(e.target.value)}
                                        placeholder="-----BEGIN RSA PRIVATE KEY-----..."
                                    ></textarea>
                                )}
                                <p className="text-xs text-red-500 mt-1">
                                    Warning: Storing SSH private keys directly in the frontend/database is highly insecure. Use a secure backend for this.
                                </p>
                            </div>
                        )}
                    </fieldset>

                    <fieldset className="mb-6 p-4 border border-gray-300 rounded-lg">
                        <legend className="text-lg font-semibold text-gray-800 px-2">GitHub Webhook</legend>
                        <div className="mb-4 flex items-center">
                            <input
                                type="checkbox"
                                id="webhookEnabled"
                                className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                checked={webhookEnabled}
                                onChange={(e) => setWebhookEnabled(e.target.checked)}
                            />
                            <label htmlFor="webhookEnabled" className="ml-2 text-gray-700 font-bold">Enable Webhook for this site</label>
                        </div>
                        {webhookEnabled && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="webhookUrl" className="block text-gray-700 text-sm font-bold mb-2">Webhook URL:</label>
                                    <input
                                        type="text"
                                        id="webhookUrl"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight bg-gray-100"
                                        value={webhookUrl}
                                        readOnly
                                        placeholder="Will be generated by backend (e.g., https://your-backend.com/webhooks/github/website_id)"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This URL would be generated by your backend and registered with GitHub.
                                    </p>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="webhookSecret" className="block text-gray-700 text-sm font-bold mb-2">Webhook Secret:</label>
                                    <input
                                        type="text"
                                        id="webhookSecret"
                                        className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={webhookSecret}
                                        onChange={(e) => setWebhookSecret(e.target.value)}
                                        placeholder="Enter a secret token for webhook verification"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        This secret is used by GitHub to sign payloads. Your backend will verify it.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setMessage('Simulating webhook registration. This would trigger a backend API call to register the webhook with GitHub.')}
                                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 text-sm"
                                >
                                    Simulate Register Webhook
                                </button>
                            </>
                        )}
                    </fieldset>

                    <div className="mb-6">
                        <label htmlFor="clusterId" className="block text-gray-700 text-sm font-bold mb-2">Deploy to Cluster:</label>
                        <select
                            id="clusterId"
                            className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={clusterId}
                            onChange={(e) => setClusterId(e.target.value)}
                            required
                        >
                            {clusters.length === 0 && <option value="">No clusters available</option>}
                            {clusters.map(cluster => (
                                <option key={cluster.id} value={cluster.id}>{cluster.name} ({cluster.sharedIp})</option>
                            ))}
                        </select>
                        {clusters.length === 0 && (
                            <p className="text-red-500 text-xs italic mt-1">Please create a cluster first.</p>
                        )}
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
                            disabled={clusters.length === 0}
                        >
                            {website ? 'Update Website' : 'Add Website'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditWebsiteModal;
