const { HotspringModel, DataTypes } = require('hotspring-framework');

class Design extends HotspringModel {
    static modelName = 'design';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      designID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, required: true },
      description: { type: DataTypes.TEXT, required: false }
    };
    static sequelizeConnections = [];
  }

  module.exports = Design;