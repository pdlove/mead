const { HotspringModel, DataTypes } = require('hotspring-framework');

class Interface extends HotspringModel {
  static modelName = 'interface';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    interfaceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceID: { type: DataTypes.INTEGER, required: true },
    vlanID: { type: DataTypes.INTEGER, required: true },
    networkID: { type: DataTypes.INTEGER, required: true },
    name: { type: DataTypes.STRING(255), required: false, defaultValue: null },
    alias: { type: DataTypes.STRING(255), required: false, defaultValue: null },
    hardwareName: { type: DataTypes.STRING(255), required: false, defaultValue: null },
    interfaceType: { type: DataTypes.STRING(255), required: false, defaultValue: null },
    speed: { type: DataTypes.STRING(255), required: false, defaultValue: null },
    IPv4Address: { type: DataTypes.INET, required: false, defaultValue: null }, //This represents the default address to use.
    IPv4Subnet: { type: DataTypes.INET, required: false, defaultValue: null }, //This represents the default address to use.
    IPv6Address: { type: DataTypes.INET, required: false, defaultValue: null }, //This represents the default address to use.
    IPv6Subnet: { type: DataTypes.INET, required: false, defaultValue: null }, //This represents the default address to use.
    MACAddress: { type: DataTypes.MACADDR, required: false, defaultValue: null }, //This represents the default address to use.
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
  };
  static sequelizeConnections = [
    { connectionType: "1M", parentmodel: "network.interface", childParentKey: 'interfaceID', childmodel: "network.interfaceaddress", required: true }
  ]
}

module.exports = Interface;
