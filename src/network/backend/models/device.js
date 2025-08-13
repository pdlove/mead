const { HotspringModel, DataTypes, Op } = require('hotspring-framework');

class Device extends HotspringModel {
  static modelName = 'device';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    deviceID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    locationID: { type: DataTypes.INTEGER, defaultValue: null },
    baseIPv4: { type: DataTypes.INET, defaultValue: null },
    baseIPv6: { type: DataTypes.INET, defaultValue: null },
    baseMAC: { type: DataTypes.MACADDR, defaultValue: null },
    deviceName: { type: DataTypes.STRING(255), defaultValue: 'New Device' },
    manufacturer: { type: DataTypes.STRING(255), defaultValue: null },
    model: { type: DataTypes.STRING(255), defaultValue: null },
    serialNumber: { type: DataTypes.STRING(255), defaultValue: null },
    assetTag: { type: DataTypes.STRING(255), defaultValue: null },
    deviceType: { type: DataTypes.STRING(255), defaultValue: null },
    syslogProcessor: { type: DataTypes.STRING(255), defaultValue: null },
    snmpCommunity: { type: DataTypes.STRING(255), defaultValue: null },
    snmpVersion: { type: DataTypes.INTEGER, defaultValue: null },
    deviceType: { type: DataTypes.STRING(255), defaultValue: null },
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
  };
  
  static sequelizeConnections = [
    { connectionType: "1M", parentmodel: "network.device", childParentKey: 'deviceID', childmodel: "network.interface", required: false },
    { connectionType: "1M", parentmodel: "network.device", childParentKey: 'deviceID', childmodel: "network.interfaceaddress", required: false }
  ]

  static async findHostByAddress(address, addressType, networkID = null) {
    // For now, addressType will be "MAC", "IPv4", or "IPv6". networkID doesn't currently apply.
    const whereClause = {};
    if (addressType === "MAC") {
      whereClause.baseMAC = address;
    } else if (addressType === "IPv4") {
      whereClause.baseIPv4 = address;
    } else if (addressType === "IPv6") {
      whereClause.baseIPv6 = address;
    } else {
      throw new Error("Invalid address type. Must be 'MAC', 'IPv4', or 'IPv6'.");
    }

    // Search for the device in the base addresses
    let device = await this.sequelizeObject.findOne({ where: whereClause });
    if (device) return device.dataValues;

    // If not found in base addresses, check interfaceaddresses
    const interfaceAddress = await this.sequelizeObject.sequelize.models['interfaceaddress'].findOne({
      where: {
        [addressType === "MAC" ? "MACAddress" : "IPAddress"]: address
      }
    });

    if (interfaceAddress && interfaceAddress.interface) {
      device = await this.sequelizeObject.findOne({
        where: { deviceID: interfaceAddress.deviceID }
      });      
    }
    if (device) return device.dataValues;
    return null; // Returns null if no device is found
  }

  static async createHost(options) {
    // This will be passed any number of fields and will create a new host based on the information.
    // The host object will be returned.

    // Validate required fields
    if (!options.deviceName) options.deviceName = "New Device";

    // Create the new device in the database
    const newDevice = await this.sequelizeObject.create({
      deviceName: options.deviceName,
      baseIPv4: options.baseIPv4 || null,
      baseIPv6: options.baseIPv6 || null,
      baseMAC: options.baseMAC || null,
      manufacturer: options.manufacturer || null,
      model: options.model || null,
      serialNumber: options.serialNumber || null,
      assetTag: options.assetTag || null,
      deviceType: options.deviceType || null,
      LastDetected: options.LastDetected || null,
      locationID: options.locationID || null
    });

    // Handle interfaces array if provided
    if (Array.isArray(options.interfaces)) {
      for (const iface of options.interfaces) {
        // Check if the interface already exists for the device
        let existingInterface = await this.sequelizeObject.sequelize.models['interface'].findOne({
          where: {
            deviceID: newDevice.deviceID,
            [Op.or]: [
              { name: iface.interface },
              { alias: iface.interface }
            ]
          }
        });

        // If the interface doesn't exist, create it
        if (!existingInterface) {
          existingInterface = await this.sequelizeObject.sequelize.models['interface'].create({
            deviceID: newDevice.deviceID,
            name: iface.interface,
            mac: iface.mac || null
          });
        }

        // Extract IP version from family if it starts with "IPv"
        const ipVersion = iface.family && iface.family.startsWith("IPv")
          ? parseInt(iface.family[3], 10)
          : null;

        // Create a new interfaceAddress for the interface
        if (iface.ip) {
          await this.sequelizeObject.sequelize.models['interfaceaddress'].create({
            interfaceID: existingInterface.interfaceID,
            deviceID: newDevice.deviceID,
            MACAddress: iface.mac || null,
            IPAddress: iface.ip || null,
            IPVersion: ipVersion
          });
        }
      }
    }
    return newDevice.dataValues; // Returns the newly created device
  }
}

module.exports = Device;
