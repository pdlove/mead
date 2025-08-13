const { HotspringModel, DataTypes } = require('hotspring-framework');
const zlib = require('zlib');

class LogEntryMessage extends HotspringModel {
  static modelName = 'logentrymessage';
  static filterRequired = true;
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    logEntryID:  { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
    // The message is stored as a compressed blob.
    message: { type: DataTypes.BLOB, allowNull: false, get(rawValue) {
      if (rawValue == undefined) valu = this.getDataValue('message');
      return rawValue ? zlib.inflateSync(Buffer.from(rawValue)).toString('utf-8') : null;
    }, set(value) {
      this.setDataValue('message', zlib.deflateSync(Buffer.from(value, 'utf-8')));
    }},
  };

  static primaryKey = ['batchID', 'lineID'];

  // static sequelizeConnections = [
  //   { parentType: "syslog.logentry", parentKey: ['batchID', 'lineID'], childType: "syslog.Logentrymessage", childKey: ['batchID', 'lineID'] },
  // ]
}

module.exports = LogEntryMessage;