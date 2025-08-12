const { HotspringModel, DataTypes } = require('hotspring-framework');

class SNMPWalkValueHistorical extends HotspringModel {
  static modelName = 'snmpWalkValueHistorical';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    oid: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: true },
    valueType: { type: DataTypes.STRING, allowNull: true },
    timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    deviceId: { type: DataTypes.UUIDV4, allowNull: false },
    snmpWalkId: { type: DataTypes.UUIDV4, allowNull: false },
    isNew: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isChanged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isRemoved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    changedAmount: { type: DataTypes.FLOAT, allowNull: true },
    changedSeconds: { type: DataTypes.INTEGER, allowNull: true }     
  };
  static sequelizeOptions = {
    updatedAt: 'timestamp',
    createdAt: 'timestamp'
  };
  static sequelizeConnections = [
    { connection: "1M", parentType: "snmp.snmpWalk", parentKey: "snmpWalkId", childType: "snmp.snmpWalkValueHistorical", childKey: "snmpWalkId" },
    { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceId", childType: "snmp.snmpWalkValueHistorical", childKey: "deviceId" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = SNMPWalkValueHistorical;