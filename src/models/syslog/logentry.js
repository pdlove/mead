const { HotspringModel, DataTypes } = require('hotspring-framework');
const LogEntryMessage = require('./logentrymessage.js');

class LogEntry extends HotspringModel {
  static modelName = 'logentry';
  static filterRequired = true;
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    logEntryID:  { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true  },
    batchID: { type: DataTypes.INTEGER, allowNull: false },
    deviceID: { type: DataTypes.INTEGER, allowNull: false },
    facility: {type: DataTypes.SMALLINT, allowNull: true, },
    severity: {type: DataTypes.SMALLINT, allowNull: true, },
    time: {type: DataTypes.DATE, allowNull: true, },
    state: {type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, validate: { isIn: [[0, 2, 11, 13, 14]]} }
  };

  static sequelizeConnections = [    
    { connectionType: "11", parentmodel: "syslog.logentry", childParentKey: 'logEntryID', childmodel: "syslog.logentrymessage", required: true }
  ]


  static StateEnum = {0: 'Created', 2: 'UnProcessed', 11:'Processed', 13:'Ignored', 14:'Error',
                      'Created':0, 'UnProcessed':2, 'Processed':11, 'Ignored':13, 'Error':14};
}

module.exports = LogEntry;