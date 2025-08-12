const { HotspringModel, DataTypes } = require('hotspring-framework');

class Product extends HotspringModel {
  static modelName = 'product';
  static autoRoute = true;
  static defaultWriteAccess = 'admin';
  static defaultReadAccess = 'admin';

  static sequelizeDefinition = {
    productID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, required: true },
    category: { type: DataTypes.STRING, required: true },
    shape: { type: DataTypes.STRING, required: true },
    height: { type: DataTypes.FLOAT, required: false, defaultValue: null },
    width: { type: DataTypes.FLOAT, required: false, defaultValue: null },
    diameter: { type: DataTypes.FLOAT, required: false, defaultValue: null },
    designPositions: { type: DataTypes.JSON, required: false, defaultValue: [] }
  };
  static sequelizeConnections = [];
}

module.exports = Product;
