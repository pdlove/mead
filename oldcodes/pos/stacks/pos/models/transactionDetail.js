const { HotspringModel, DataTypes } = require('hotspring-framework');

class TransactionDetail extends HotspringModel {
    static modelName = 'transactiondetail';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      transactionDetailID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      transactionID: { type: DataTypes.INTEGER, required: true },
      inventoryID: { type: DataTypes.INTEGER, required: true },
      price: { type: DataTypes.FLOAT, required: true },
      cost: { type: DataTypes.FLOAT, required: false }
    };
    static sequelizeConnections = [
      { connection: "1M", parentType: "transaction", parentKey: "transactionID", childType: "transactiondetail", childKey: "transactionID" },
      { connection: "1M", parentType: "inventory", parentKey: "inventoryID", childType: "transactiondetail", childKey: "inventoryID" }
    ];
  }

  module.exports = TransactionDetail;