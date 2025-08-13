const { HotspringModel, DataTypes } = require('hotspring-framework');

class InterfaceAddress extends HotspringModel {
  static modelName = 'interfaceaddress';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    interfaceAddressID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    interfaceID: { type: DataTypes.INTEGER, required: true },
    deviceID: { type: DataTypes.INTEGER, required: true },
    MACAddress: { type: DataTypes.MACADDR, required: false, defaultValue: null }, 
    IPVersion: { type: DataTypes.INTEGER, required: false },
    IPAddress: { type: DataTypes.INET, required: false, defaultValue: null },
    IPSubnet: { type: DataTypes.INET, required: false, defaultValue: null },
    IPGateway: { type: DataTypes.INET, required: false, defaultValue: null },
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
  };
  static sequelizeConnections = [    
    //Connects to device and interface.

  ]
}

module.exports = InterfaceAddress;
