module.exports = (sequelize, DataTypes) => {
  const InterfacePerformanceMetric = sequelize.define(
    "InterfacePerformanceMetric",
    {
      metricId: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      interfaceId: { type: DataTypes.INTEGER, allowNull: false },
      inOctets: { type: DataTypes.BIGINT, allowNull: false },
      outOctets: { type: DataTypes.BIGINT, allowNull: false },
      inUcastPkts: { type: DataTypes.BIGINT, allowNull: false },
      outUcastPkts: { type: DataTypes.BIGINT, allowNull: false },
      highSpeed: { type: DataTypes.BOOLEAN, allowNull: false },
      timestamp: { type: DataTypes.DATE, allowNull: false },
    },
    { schema: "inventory", tableName: "interface_performance" }
  );

  InterfacePerformanceMetric.associate = models => {
    InterfacePerformanceMetric.belongsTo(models.DeviceInterface, {
      foreignKey: 'interfaceId',
      targetKey: 'interfaceId',
      onDelete: 'CASCADE',
    });
  };

  return InterfacePerformanceMetric;
};
