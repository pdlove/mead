import { CarpenterModel, DataTypes } from "../../carpenter/CarpenterModel.js";
import CarpenterModelRelationship from "../../carpenter/CarpenterModelRelationship.js";

export class LogBatch extends CarpenterModel {
    static sequelizeDefinition = {
        batchID: { type: DataTypes.UUIDV4, allowNull: false, primaryKey: true },
        collectorID: { type: DataTypes.UUIDV4, allowNull: false },
        collectorIP: { type: DataTypes.INET, allowNull: false },
        batchStartTime: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        batchEndTime: { type: DataTypes.DATE },
        processingByID: { type: DataTypes.UUIDV4, allowNull: true },
        processingStartTime: { type: DataTypes.DATE },
        processingEndTime: { type: DataTypes.DATE },
        totalLines: { type: DataTypes.BIGINT, defaultValue: 0 },
        processedLines: { type: DataTypes.BIGINT, defaultValue: 0 },
        state: { type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, enumValues: { 0: 'Created', 1: 'Active', 2: 'UnProcessed', 11: 'Processed', 12: 'Ignored', 13: 'Error' }, },
    };
    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Device",
            required: true, childParentKey: 'collectorID', childModelName: "LogBatch" }),
    ]
}

export class LogEntry extends CarpenterModel {
    static sequelizeDefinition = {
        logEntryID: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        batchID: { type: DataTypes.UUIDV4, allowNull: false },
        deviceID: { type: DataTypes.UUIDV4, allowNull: false },
        facility: { type: DataTypes.SMALLINT, allowNull: true, },
        severity: { type: DataTypes.SMALLINT, allowNull: true, },
        time: { type: DataTypes.DATE, allowNull: true, },
        state: { type: DataTypes.SMALLINT, defaultValue: 0, allowNull: false, validate: { isIn: [[0, 2, 11, 13, 14]] } }
    };

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Organization",
            required: true, childParentKey: 'organizationId', childModelName: "User" }),
    ]


    static StateEnum = {
        0: 'Created', 2: 'UnProcessed', 11: 'Processed', 13: 'Ignored', 14: 'Error',
        'Created': 0, 'UnProcessed': 2, 'Processed': 11, 'Ignored': 13, 'Error': 14
    };
}

const { HotspringModel, DataTypes } = require('hotspring-framework');
const zlib = require('zlib');

class LogEntryMessage extends HotspringModel {
    static modelName = 'logentrymessage';
    static filterRequired = true;
    static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
    static defaultWriteAccess = 'admin'; //admin, user, public
    static defaultReadAccess = 'admin'; //admin, user, public

    static sequelizeDefinition = {
        logEntryID: { type: DataTypes.BIGINT, allowNull: false, primaryKey: true },
        // The message is stored as a compressed blob.
        message: {
            type: DataTypes.BLOB, allowNull: false, get(rawValue) {
                if (rawValue == undefined) valu = this.getDataValue('message');
                return rawValue ? zlib.inflateSync(Buffer.from(rawValue)).toString('utf-8') : null;
            }, set(value) {
                this.setDataValue('message', zlib.deflateSync(Buffer.from(value, 'utf-8')));
            }
        },
    };

    static primaryKey = ['batchID', 'lineID'];

    // static sequelizeConnections = [
    //   { parentType: "syslog.logentry", parentKey: ['batchID', 'lineID'], childType: "syslog.Logentrymessage", childKey: ['batchID', 'lineID'] },
    // ]
}

module.exports = LogEntryMessage;