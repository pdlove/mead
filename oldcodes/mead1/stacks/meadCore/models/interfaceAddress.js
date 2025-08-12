const { HotspringModel, DataTypes } = require('hotspring-framework');
class InterfaceAddress extends HotspringModel {
  static modelName = 'interfaceaddress';
  static sequelizeDefinition = {
    addressID: { type: DataTypes.UUIDV4, primaryKey: true },
    interfaceID: { type: DataTypes.UUIDV4, allowNull: false },
    ipAddress: { type: DataTypes.STRING, allowNull: false },
    isIPv6: { type: DataTypes.BOOLEAN, allowNull: false },
    lastSeenAt: DataTypes.DATE
  };
}

module.exports = InterfaceAddress;