const { HotspringModel, DataTypes } = require('hotspring-framework');

class Customer extends HotspringModel {
    static modelName = 'customer';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      customerID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, required: true },
      email: { type: DataTypes.STRING, required: false },
      phone: { type: DataTypes.STRING, required: false },
      address: { type: DataTypes.TEXT, required: false },
      notes: { type: DataTypes.TEXT, required: false },
      excludeFromMailers: { type: DataTypes.BOOLEAN, required: false, defaultValue: false }
    };
    static sequelizeConnections = [];
  }

  module.exports = Customer;