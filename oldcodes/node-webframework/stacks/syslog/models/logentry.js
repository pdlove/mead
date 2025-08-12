const { HotspringModel, DataTypes } = require('hotspring-framework');

class LogEntry extends HotspringModel {
  static modelName = 'logentry';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    batchID: { type: DataTypes.INTEGER, allowNull: false, },
    lineID:  { type: DataTypes.INTEGER, allowNull: false, },
    sourceIP: { type: DataTypes.INET, allowNull: false },
    facility: {type: DataTypes.SMALLINT, allowNull: false, },
    severity: {type: DataTypes.SMALLINT, allowNull: false, },
    time: {type: DataTypes.DATE, allowNull: false, },
    //message: {type: DataTypes.BLOB, allowNull: false, },
    message: {type: DataTypes.TEXT, allowNull: false, },
    state: {type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, enumValues: {0: 'Created', 2: 'UnProcessed', 11:'Processed', 12:'Ignored', 13:'Error'}, },    
  };
  static sequelizeConnections = [
    { connection: "1M", parentType: "syslog.LogBatch", parentKey: "batchID", childType: "syslog.LogEntry", childKey: "batchID" },
    // { connection: "MM", type1: "system.group", Key1: "groupID", type2: "system.menu", Key2: "menuID", midType: "system.group_menu" }
  ]
}

module.exports = LogEntry;