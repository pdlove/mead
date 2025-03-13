const { HotspringModel, DataTypes } = require('hotspring-framework');

class NetworkInterfaceAddress extends HotspringModel {
  static modelName = 'networkinterfaceadress';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    networkInterfaceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    IPVersion: { type: DataTypes.INTEGER, required: true },
    IPAddress: { type: DataTypes.INET, required: false, defaultValue: null },
    IPSubnet: { type: DataTypes.INET, required: false, defaultValue: null },
    IPGateway: { type: DataTypes.INET, required: false, defaultValue: null },
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
  };
  static sequelizeConnections = [
    // { connection: "1M", parentType: "system.group", parentKey: "groupID", childType: "system.group_menu", childKey: "groupID" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = NetworkInterfaceAddress;
