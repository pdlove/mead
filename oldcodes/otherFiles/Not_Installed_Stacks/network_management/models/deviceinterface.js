module.exports = (sequelize, DataTypes) => {
  const DeviceInterface = sequelize.define(
    "DeviceInterface",
    {
      interfaceId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      deviceId: { type: DataTypes.INTEGER, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: true },
      alias: { type: DataTypes.STRING, allowNull: true },
      interfaceType: { type: DataTypes.STRING, allowNull: false },
      snmpIndex: { type: DataTypes.INTEGER, allowNull: false },
      adminStatus: { type: DataTypes.ENUM("up", "down"), allowNull: false },
      functionalStatus: { type: DataTypes.ENUM("up", "down"), allowNull: false },
      speed: { type: DataTypes.INTEGER, allowNull: false },
      duplexMode: { type: DataTypes.ENUM("full", "half"), allowNull: false },
      poeStatus: { type: DataTypes.BOOLEAN, allowNull: false },
      stpStatus: { type: DataTypes.BOOLEAN, allowNull: false },
      vlansTagged: { type: DataTypes.STRING },
      vlansUntagged: { type: DataTypes.STRING },
      profileId: { type: DataTypes.INTEGER },
    },
    { schema: "inventory", tableName: "interfaces" }
  );

  DeviceInterface.associate = models => {
    DeviceInterface.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      targetKey: 'deviceId',
      onDelete: 'CASCADE',
    });
    DeviceInterface.hasMany(models.InterfacePerformanceMetric, {
      foreignKey: 'interfaceId',
      sourceKey: 'interfaceId',
      onDelete: 'CASCADE',
    });
    DeviceInterface.hasMany(models.DeviceConnection, {
      foreignKey: 'interfaceAId',
      sourceKey: 'interfaceId',
      onDelete: 'CASCADE',
    });    
    DeviceInterface.hasMany(models.DeviceConnection, {
      foreignKey: 'interfaceBId',
      sourceKey: 'interfaceId',
      onDelete: 'CASCADE',
    });    
  };

  return DeviceInterface;
};
