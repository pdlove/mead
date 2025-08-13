const { HotspringModel, DataTypes } = require('hotspring-framework');

class LogBatch extends HotspringModel {
  static modelName = 'logbatch';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    batchID: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    collectorID: { type: DataTypes.INTEGER, allowNull: false},
    collectorIP: { type: DataTypes.INET, allowNull: false },
    batchStartTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    batchEndTime: { type: DataTypes.DATE },
    processingByID: { type: DataTypes.INTEGER, allowNull: true},
    processingStartTime: { type: DataTypes.DATE },
    processingEndTime: { type: DataTypes.DATE },
    totalLines: { type: DataTypes.BIGINT, defaultValue: 0 },
    processedLines: { type: DataTypes.BIGINT, defaultValue: 0 },    
    state: {type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, enumValues: {0: 'Created', 1: 'Active', 2: 'UnProcessed', 11:'Processed', 12:'Ignored', 13:'Error'}, },
  };

  static sequelizeConnections = [    
    { connectionType: "1M", parentmodel: "syslog.logbatch", childParentKey: 'batchID', childmodel: "syslog.logentry", required: true }
  ]

}

module.exports = LogBatch;

