const { HotspringModel, DataTypes } = require('hotspring-framework');
class InterfaceConnection extends HotspringModel {
  static modelName = 'interfaceconnection';
  static sequelizeDefinition = {
    connectionID: { type: DataTypes.UUIDV4, primaryKey: true },
    interfaceAID: { type: DataTypes.UUIDV4, allowNull: false },
    interfaceBID: { type: DataTypes.UUIDV4, allowNull: false },
    connectionTypeID: { type: DataTypes.INTEGER, allowNull: false },
    speedMbps: DataTypes.INTEGER,
    lastSeenAt: DataTypes.DATE
  };

  static sequelizeConnections = [
    { connectionType: "1", parentmodel: "lookup", parentKey: 'lookupID', childKey: 'connectionTypeID', childmodel: "interfaceconnection", required: true }
  ];
}

module.exports = InterfaceConnection;