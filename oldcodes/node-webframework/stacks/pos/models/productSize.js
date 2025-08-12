const { HotspringModel, DataTypes } = require('hotspring-framework');

class ProductSize extends HotspringModel {
    static modelName = 'productsize';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      productSizeID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      productID: { type: DataTypes.INTEGER, required: true },
      sizeName: { type: DataTypes.STRING, required: true },
      color: { type: DataTypes.STRING, required: true },
      supplier: { type: DataTypes.STRING, required: false },
      cost: { type: DataTypes.FLOAT, required: false },
      quantity: { type: DataTypes.INTEGER, required: false, defaultValue: 0 }
    };
    static sequelizeConnections = [
      { connection: "1M", parentType: "product", parentKey: "productID", childType: "productsize", childKey: "productID" }
    ];
  }

  module.exports = ProductSize;