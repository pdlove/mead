const { HotspringModel, DataTypes } = require('hotspring-framework');

class Device extends HotspringModel {
  static modelName = 'device';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'admin'; //admin, user, public

  static sequelizeDefinition = {
    deviceID: { type: DataTypes.UUIDV4, primaryKey: true },
    locationID: { type: DataTypes.UUIDV4, defaultValue: null },
    baseIPv4: { type: DataTypes.INET, defaultValue: null },
    baseIPv6: { type: DataTypes.INET, defaultValue: null },
    baseMAC: { type: DataTypes.MACADDR, defaultValue: null },
    deviceName: { type: DataTypes.STRING(255), defaultValue: 'New Device' },
    manufacturer: { type: DataTypes.STRING(255), defaultValue: null },
    model: { type: DataTypes.STRING(255), defaultValue: null },
    serialNumber: { type: DataTypes.STRING(255), defaultValue: null },
    assetTag: { type: DataTypes.STRING(255), defaultValue: null },
    deviceType: { type: DataTypes.STRING(255), defaultValue: null },
    LastDetected: { type: DataTypes.DATE, defaultValue: null }
  };
  static sequelizeConnections = [
    { connectionType: "1M", parentmodel: "meadCore.device", childParentKey: 'deviceID', childmodel: "meadCore.interface", required: false },
    { connectionType: "1M", parentmodel: "meadCore.device", childParentKey: 'deviceID', childmodel: "meadCore.interfaceaddress", required: false }
  ]

  static seedData = [
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

    // Optionally, you can add networkID filtering logic here if needed in the future.

    // Search for the device in the database
    const device = await this.sequelizeObject.findOne({ where: whereClause });
    return device; // Returns the device if found, otherwise null
}

  static async createHost(options) {
    // This will be passed any number of fields and will create a new host based on the information.
    // The host object will be returned.

    // Validate required fields
    if (!options.deviceName) options.deviceName="New Device";
    
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

    return newDevice; // Returns the newly created device
}

}

module.exports = Device;
