// src/components/DeviceTreeRow.jsx
import React from 'react';

const DeviceTreeRow = ({ device, level, onEdit, onDelete, onToggleExpand, expandedDevices }) => {
    const isExpanded = expandedDevices.includes(device.id);
    const hasChildren = device.children && device.children.length > 0;

    const getStatusClass = (status) => {
        if (status === 'Up') return 'device-status-up';
        if (status === 'Down') return 'device-status-down';
        return 'device-status-unknown';
    };

    return (
        <>
            <tr className="device-table-row">
                <td style={{ paddingLeft: `${level * 20 + 10}px` }}> {/* Indentation */}
                    {hasChildren && (
                        <span
                            className="expand-toggle"
                            onClick={() => onToggleExpand(device.id)}
                            role="button"
                            aria-expanded={isExpanded}
                            aria-controls={`children-${device.id}`}
                        >
                            {isExpanded ? '▼' : '▶'} {/* Unicode triangles for expand/collapse */}
                        </span>
                    )}
                    {/* Add some space for items without children but still indented */}
                    {!hasChildren && level > 0 && <span style={{ marginRight: '16px' }}></span>}
                    {device.name}
                </td>
                <td>{device.ipAddress}</td>
                <td>{device.category ? device.category.name : 'N/A'}</td> {/* Display category name */}
                <td>{device.parent ? device.parent.name : 'None'}</td> {/* Display parent name */}
                <td>{device.description}</td>
                <td>{device.notifyEnabled ? 'Yes' : 'No'}</td>
                <td className={getStatusClass(device.status)}>{device.status || 'N/A'}</td>
                <td>{device.lastPoll ? new Date(device.lastPoll).toLocaleString() : 'N/A'}</td>
                <td>
                    <button onClick={() => onEdit(device)} className="action-button edit-button">
                        Edit
                    </button>
                    <button onClick={() => onDelete(device.id)} className="action-button delete-button">
                        Delete
                    </button>
                </td>
            </tr>
            {isExpanded && hasChildren && (
                // Recursively render children rows
                device.children.map(child => (
                    <DeviceTreeRow
                        key={child.id}
                        device={child}
                        level={level + 1}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleExpand={onToggleExpand}
                        expandedDevices={expandedDevices}
                    />
                ))
            )}
        </>
    );
};

export default DeviceTreeRow;