const { HotspringModel, DataTypes } = require('hotspring-framework');
class VLAN extends HotspringModel {
  static modelName = 'vlan';
  static sequelizeDefinition = {
    vlanID: { type: DataTypes.UUIDV4, primaryKey: true },
    organizationID: { type: DataTypes.UUIDV4, allowNull: false },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    vlan8021qID: { type: DataTypes.INTEGER, allowNull: false },
    securityLevelID: { type: DataTypes.INTEGER, allowNull: false },
    lastSeenAt: DataTypes.DATE
  };

  static sequelizeConnections = [
    { connectionType: "1M", parentmodel: "vlan", childParentKey: 'vlanID', childmodel: "network", required: true },
    { connectionType: "1", parentmodel: "lookup", parentKey: 'lookupID', childKey: 'securityLevelID', childmodel: "vlan", required: true }
  ];

  static seedData = [
    {
      "vlanID": "f2c15b97-1d2e-49ea-a63a-b3d59aa0d0d9  ",
      "organizationID": "d11f5a17-3b5b-4a6f-96ec-77616e730cea",
      "name": "default",
      "description": "Basic Computer Network For Daily Use",
      "vlan8021qID": "1",
      "securityLevelID": "100"
    },
    {
      "vlanID": "4c82d263-9f43-4c5c-8502-d061a878388f  ",
      "organizationID": "d11f5a17-3b5b-4a6f-96ec-77616e730cea",
      "name": "test",
      "description": "Test Environment for the dangerous stuff",
      "vlan8021qID": "2",
      "securityLevelID": "40"
    },
    {
      "vlanID": "0c059404-ea00-4bdb-a3b3-1590e1705bb1  ",
      "organizationID": "d11f5a17-3b5b-4a6f-96ec-77616e730cea",
      "name": "demo",
      "description": "Demonstration Environment",
      "vlan8021qID": "3",
      "securityLevelID": "60"
    },
    {
      "vlanID": "0f5de6fa-3ab3-4fcb-b5f2-9eb81d90f337  ",
      "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
      "name": "internal",
      "description": "Company Use",
      "vlan8021qID": "1",
      "securityLevelID": "80"
    },
    {
      "vlanID": "80b594ef-1240-4e68-9bc7-5c2cfba20155  ",
      "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
      "name": "server",
      "description": "Server Core",
      "vlan8021qID": "99",
      "securityLevelID": "100"
    },
    {
      "vlanID": "39b18734-6b94-4e96-9406-98656a4a4ef3  ",
      "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
      "name": "guest",
      "description": "For Visitors and TV Access",
      "vlan8021qID": "50",
      "securityLevelID": "10"
    },
    {
      "vlanID": "71642b56-e394-4d30-bf2b-926cc2cd2a2e  ",
      "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
      "name": "testenv1",
      "description": "Simulation of PDC",
      "vlan8021qID": "101",
      "securityLevelID": "60"
    },
    {
      "vlanID": "052c8329-0a26-4b3d-8bb9-2edc9a06340f  ",
      "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
      "name": "testenv2",
      "description": "Simulation of BDC",
      "vlan8021qID": "102",
      "securityLevelID": "60"
    },
    {
      "vlanID": "ddd3e3fa-1a11-40cd-8654-012bf314091e  ",
      "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
      "name": "internal",
      "description": "Workstation use",
      "vlan8021qID": "5",
      "securityLevelID": "80"
    },
    {
      "vlanID": "1796a73e-9892-4cb4-8b4a-d92be6d68a3b  ",
      "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
      "name": "utility",
      "description": "Thermostats and non-production equipment",
      "vlan8021qID": "10",
      "securityLevelID": "60"
    },
    {
      "vlanID": "b8d509f2-9fbd-4b5d-a04d-bf874a13ab8f  ",
      "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
      "name": "server",
      "description": "Servers for tracking stuffs",
      "vlan8021qID": "32",
      "securityLevelID": "80"
    },
    {
      "vlanID": "b1bb0db1-31df-4d36-9104-1fe34567f41b  ",
      "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
      "name": "plc",
      "description": "Production Equipment",
      "vlan8021qID": "42",
      "securityLevelID": "100"
    },
    {
      "vlanID": "e214233a-4e4e-4bcb-96ed-5a007f7aa384  ",
      "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
      "name": "cameras",
      "description": "DVR and camera system",
      "vlan8021qID": "99",
      "securityLevelID": "80"
    },
    {
      "vlanID": "3dc947e9-b6a3-4b3d-a21a-e9b7a716e4fc  ",
      "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
      "name": "internal",
      "description": "Laptops and printers",
      "vlan8021qID": "1",
      "securityLevelID": "50"
    },
    {
      "vlanID": "e5b624f6-2eb2-4c84-87f0-00411f56b4a7  ",
      "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
      "name": "guest",
      "description": "",
      "vlan8021qID": "2",
      "securityLevelID": "20"
    }
  ];
}

module.exports = VLAN;