const { HotspringModel, DataTypes } = require('hotspring-framework');

class Inventory extends HotspringModel {
    static modelName = 'inventory';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      inventoryID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      productSizeID: { type: DataTypes.INTEGER, required: true },
      designID: { type: DataTypes.INTEGER, required: false, defaultValue: null },
      quantity: { type: DataTypes.INTEGER, required: true }
    };
    static sequelizeConnections = [
      { connection: "1M", parentType: "productsize", parentKey: "productSizeID", childType: "inventory", childKey: "productSizeID" },
      { connection: "1M", parentType: "design", parentKey: "designID", childType: "inventory", childKey: "designID" }
    ];
  }

  module.exports = Inventory;