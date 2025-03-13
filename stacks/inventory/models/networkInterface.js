const { HotspringModel, DataTypes } = require('hotspring-framework');

class NetworkInterface extends HotspringModel {
  static modelName = 'networkinterface';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    networkInterfaceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    deviceID: { type: DataTypes.INTEGER, required: true },
    vlanID: { type: DataTypes.INTEGER, required: true },    
    IPv4Address: { type: DataTypes.INET, required: false, defaultValue: null },
    IPv4Subnet: { type: DataTypes.INET, required: false, defaultValue: null },
    IPv6Address: { type: DataTypes.INET, required: false, defaultValue: null },
    IPv6Subnet: { type: DataTypes.INET, required: false, defaultValue: null },
    MACAddress: { type: DataTypes.STRING(255), required: false, defaultValue: 'New Device' },
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
  };
  static sequelizeConnections = [
    // { connection: "1M", parentType: "system.group", parentKey: "groupID", childType: "system.group_menu", childKey: "groupID" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = NetworkInterface;
