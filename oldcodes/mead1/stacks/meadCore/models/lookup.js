const { HotspringModel, DataTypes } = require('hotspring-framework');
class Lookup extends HotspringModel {
  static modelName = 'lookup';
  static sequelizeDefinition = {
    lookupID: { type: DataTypes.UUIDV4, primaryKey: true },
    lookupInt: { type: DataTypes.INTEGER, allowNull: false },
    category: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    lastSeenAt: DataTypes.DATE
  };

  static seedData = [
    // Security Levels
    { lookupInt: 0, category: 'security_level', code: 'public_guest', name: 'Public / Guest', description: 'Open or auth-only (e.g., guest Wi-Fi)' },
    { lookupInt: 20, category: 'security_level', code: 'internal_user', name: 'Internal General User', description: 'Standard employee/user traffic' },
    { lookupInt: 40, category: 'security_level', code: 'internal_sens', name: 'Internal Sensitive', description: 'HR, Finance, PII/PCI systems' },
    { lookupInt: 60, category: 'security_level', code: 'admin_only', name: 'Admin-only', description: 'Admin access only' },
    { lookupInt: 80, category: 'security_level', code: 'mgmt_net', name: 'Management Network', description: 'OOB device management' },
    { lookupInt: 100, category: 'security_level', code: 'high_sec', name: 'High Security / Secure Ops', description: 'Critical infrastructure, SOC, etc.' },

    // Connection Types
    { lookupInt: 1, category: 'connection_type', code: 'wired', name: 'Wired', description: 'Ethernet, Fiber, etc.' },
    { lookupInt: 2, category: 'connection_type', code: 'wireless', name: 'Wireless', description: 'Wi-Fi, 802.11x' },
    { lookupInt: 3, category: 'connection_type', code: 'lldp', name: 'LLDP Discovery', description: 'Discovered via LLDP' },
    { lookupInt: 4, category: 'connection_type', code: 'cdp', name: 'CDP Discovery', description: 'Discovered via Cisco Discovery Protocol' },
    { lookupInt: 5, category: 'connection_type', code: 'manual', name: 'Manual', description: 'Entered manually' }
  ];
}

module.exports = Lookup;