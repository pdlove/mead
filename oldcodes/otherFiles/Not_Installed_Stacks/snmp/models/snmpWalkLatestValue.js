module.exports = (sequelize, DataTypes) => {
    const snmpWalkLatestValue = sequelize.define('snmpWalkLatestValue', {
      oid: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: true },
      valueType: { type: DataTypes.STRING, allowNull: true },
      firstSeen: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      lastChange: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      lastSeen: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      deviceId: { type: DataTypes.INTEGER, allowNull: false },
      snmpWalkId: { type: DataTypes.INTEGER, allowNull: false },
      changedAmount: { type: DataTypes.FLOAT, allowNull: true },
      changedSeconds: { type: DataTypes.INTEGER, allowNull: true }
    }, {
      updatedAt: 'lastChange',
      createdAt: 'firstSeen'
    });
  
    snmpWalkLatestValue.associate = (models) => {
      snmpWalkLatestValue.belongsTo(models.SNMPWalkConfig, { foreignKey: 'snmpWalkId', onDelete: 'CASCADE' });
      snmpWalkLatestValue.belongsTo(models.Device, { foreignKey: 'deviceId', onDelete: 'CASCADE' }); // Associate with Device
    };
  
    return snmpWalkLatestValue;
  };
  