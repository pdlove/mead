const { HotspringModel, DataTypes } = require('hotspring-framework');

class SNMPWalkValueRunning extends HotspringModel {
  static modelName = 'snmpWalkValueRunning';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    oid: { type: DataTypes.STRING, allowNull: false },
    value: { type: DataTypes.STRING, allowNull: true },
    valueType: { type: DataTypes.STRING, allowNull: true },
    deviceId: { type: DataTypes.INTEGER, allowNull: false },
    snmpWalkId: { type: DataTypes.INTEGER, allowNull: false }      
};
  static sequelizeOptions = {
    updatedAt: 'lastChange',
    createdAt: 'firstSeen'
};
  static sequelizeConnections = [
    { connection: "1M", parentType: "snmp.snmpWalk", parentKey: "snmpWalkId", childType: "snmp.snmpWalkValueHistorical", childKey: "snmpWalkId" },
    { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceId", childType: "snmp.snmpWalkValueHistorical", childKey: "deviceId" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
  //snmpWalkLatestValue.belongsTo(models.SNMPWalkConfig, { foreignKey: 'snmpWalkId', onDelete: 'CASCADE' });
  //snmpWalkLatestValue.belongsTo(models.Device, { foreignKey: 'deviceId', onDelete: 'CASCADE' }); // Associate with Device

}

module.exports = SNMPWalkValueRunning;