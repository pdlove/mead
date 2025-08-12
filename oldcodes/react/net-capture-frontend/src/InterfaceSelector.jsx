import React from 'react';
import './App.css';

function InterfaceSelector({ interfaces, onSelect }) {
  return (
    <div className="interface-selector">
      <h2>Select Interface for Capture</h2>
      <table className="compact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Addresses</th>
          </tr>
        </thead>
        <tbody>
          {interfaces.map((iface, i) => (
            <tr key={i} onClick={() => onSelect(iface.name)}>
              <td>{iface.name}</td>
              <td>{iface.description}</td>
              <td>
                {(iface.addresses || [])
                  .map(addr => addr.addr)
                  .join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterfaceSelector;
