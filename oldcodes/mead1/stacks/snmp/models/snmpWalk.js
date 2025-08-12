  const { HotspringModel, DataTypes } = require('hotspring-framework');

  class SNMPWalk extends HotspringModel {
    static modelName = 'snmpWalk';
    static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
    static defaultWriteAccess = 'admin'; //admin, user, public
    static defaultReadAccess = 'admin'; //admin, user, public
  
    static sequelizeDefinition = {
      snmpWalkId: { type: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
      deviceId: { type: DataTypes.UUIDV4, allowNull: false },
      community: { type: DataTypes.STRING, allowNull: false },
      requested: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      runningOn: { type: DataTypes.STRING, allowNull: false },
      completed: { type: DataTypes.DATE, allowNull: true },      
      rootOID: { type: DataTypes.STRING, allowNull: false }
  };

    static sequelizeConnections = [
      { connection: "1M", parentType: "inventory.networkdevice", parentKey: "deviceId", childType: "snmp.snmpWalkValueHistorical", childKey: "deviceId" },
      // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
    ]
    //snmpWalkLatestValue.belongsTo(models.SNMPWalkConfig, { foreignKey: 'snmpWalkId', onDelete: 'CASCADE' });
    //snmpWalkLatestValue.belongsTo(models.Device, { foreignKey: 'deviceId', onDelete: 'CASCADE' }); // Associate with Device
  
  }
  
  module.exports = SNMPWalk;