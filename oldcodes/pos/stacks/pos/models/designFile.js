const { HotspringModel, DataTypes } = require('hotspring-framework');

class DesignFile extends HotspringModel {
    static modelName = 'designfile';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      designFileID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      designID: { type: DataTypes.INTEGER, required: true },
      fileUrl: { type: DataTypes.STRING, required: true },
      originalFileName: { type: DataTypes.STRING, required: false },
      fileType: { type: DataTypes.STRING, required: false },
      position: { type: DataTypes.STRING, required: false, defaultValue: null },
      purpose: { type: DataTypes.STRING, required: true }
    };
    static sequelizeConnections = [
      { connection: "1M", parentType: "design", parentKey: "designID", childType: "designfile", childKey: "designID" }
    ];
  }

module.exports = DesignFile;  