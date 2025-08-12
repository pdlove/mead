const { HotspringModel, DataTypes } = require('hotspring-framework');
class Interface extends HotspringModel {
  static modelName = 'interface';
  static sequelizeDefinition = {
    interfaceID: { type: DataTypes.UUIDV4, primaryKey: true },
    deviceID: { type: DataTypes.UUIDV4, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    defaultIPv4AddressID: DataTypes.INTEGER,
    defaultIPv6AddressID: DataTypes.INTEGER,
    lastSeenAt: DataTypes.DATE
  };

  static sequelizeConnections = [
    { connectionType: "1M", parentmodel: "interface", childParentKey: 'interfaceID', childmodel: "interfaceaddress", required: true },
    { connectionType: "1M", parentmodel: "interface", childParentKey: 'interfaceID', childmodel: "interfacevlanassignment", required: true }
  ];
}

module.exports = Interface;