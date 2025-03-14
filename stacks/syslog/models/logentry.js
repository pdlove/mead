const { HotspringModel, DataTypes } = require('hotspring-framework');
const LogEntryMessage = require('./logentrymessage.js');

class LogEntry extends HotspringModel {
  static modelName = 'logentry';
  static filterRequired = true;
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    batchID: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    lineID:  { type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
    sourceIP: { type: DataTypes.INET, allowNull: true },
    facility: {type: DataTypes.SMALLINT, allowNull: true, },
    severity: {type: DataTypes.SMALLINT, allowNull: true, },
    time: {type: DataTypes.DATE, allowNull: true, },
    state: {type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, validate: { isIn: [[0, 2, 11, 13, 14]]} }
  };

  static sequelizeConnections = [
    { connection: "1M", parentType: "syslog.LogBatch", parentKey: "batchID", childType: "syslog.LogEntry", childKey: "batchID" },
    { connection: "1M", parentType: "syslog.LogEntry", parentKey: ["batchID", "lineID"], childType: "syslog.LogEntryMessage", childKey: ["batchID", "lineID"] }
  ]

  static StateEnum = {0: 'Created', 2: 'UnProcessed', 11:'Processed', 13:'Ignored', 14:'Error',
                      'Created':0, 'UnProcessed':2, 'Processed':11, 'Ignored':13, 'Error':14};
}

module.exports = LogEntry;