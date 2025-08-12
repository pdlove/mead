module.exports = (sequelize, DataTypes) => {
    const snmpWalkValue = sequelize.define('snmpWalkValue', {
      oid: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: true },
      valueType: { type: DataTypes.STRING, allowNull: true },
      timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
      deviceId: { type: DataTypes.INTEGER, allowNull: false },
      snmpWalkId: { type: DataTypes.INTEGER, allowNull: false },
      isNew: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      isChanged: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      isRemoved: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      changedAmount: { type: DataTypes.FLOAT, allowNull: true },
      changedSeconds: { type: DataTypes.INTEGER, allowNull: true }      
    }, {
      updatedAt: 'timestamp',
      createdAt: 'timestamp'
    });
  
    snmpWalkValue.associate = (models) => {
      snmpWalkValue.belongsTo(models.snmpWalk, { foreignKey: 'snmpWalkId', onDelete: 'CASCADE' });
        snmpWalkValue.belongsTo(models.Device, { foreignKey: 'deviceId', onDelete: 'CASCADE' }); // Associate with Device
    };
  
    return snmpWalkValue;
  };
  