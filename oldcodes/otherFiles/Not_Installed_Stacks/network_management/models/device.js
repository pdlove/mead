module.exports = (sequelize, DataTypes) => {
  const Device = sequelize.define(
    "Device",
    {
      deviceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      location: { type: DataTypes.STRING, allowNull: false },
      managementIP: { type: DataTypes.STRING, allowNull: true },
      managementVLAN: { type: DataTypes.STRING, allowNull: true },
      managementMAC: { type: DataTypes.STRING, allowNull: true },
      lastPollTime: { type: DataTypes.DATE, allowNull: true },
      lastPerformancePollTime: { type: DataTypes.DATE, allowNull: true },
      pollingMethod: { type: DataTypes.STRING, allowNull: true },
      snmpCommunity: { type: DataTypes.STRING, allowNull: true },
      snmpVersion: { type: DataTypes.STRING, allowNull: true },
      snmpLastFullWalk: { type: DataTypes.DATE, allowNull: true },
      addedByUser: { type: DataTypes.STRING, allowNull: true },
    },
    { schema: "inventory", tableName: "devices" }
  );

  Device.associate = models => {
    Device.hasMany(models.DeviceInterface, {
      foreignKey: "deviceId",
      onDelete: "CASCADE",
    });
  };

  return Device;
};
