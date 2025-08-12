const { HotspringModel, DataTypes } = require('hotspring-framework');

class Transaction extends HotspringModel {
    static modelName = 'transaction';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      transactionID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      customerID: { type: DataTypes.INTEGER, required: true },
      total: { type: DataTypes.FLOAT, required: true },
      paymentMethod: { type: DataTypes.STRING, required: true }
    };
    static sequelizeConnections = [
      { connection: "1M", parentType: "customer", parentKey: "customerID", childType: "transaction", childKey: "customerID" }
    ];
  }

  module.exports = Transaction;