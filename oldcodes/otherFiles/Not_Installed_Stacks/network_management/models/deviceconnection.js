module.exports = (sequelize, DataTypes) => {
    const DeviceConnection = sequelize.define('DeviceConnection', {
        interfaceAId: { type: DataTypes.INTEGER, allowNull: false },
        interfaceBId: { type: DataTypes.INTEGER, allowNull: false },
        connectionTypeA: { type: DataTypes.STRING, allowNull: false },
        connectionTypeB: { type: DataTypes.STRING, allowNull: false },
        cableType: { type: DataTypes.STRING, allowNull: false },
        discoveryMethod: { type: DataTypes.STRING, allowNull: false },
        confidenceScore: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1, max: 10 }
        }
    });

    DeviceConnection.associate = models => {
        DeviceConnection.belongsTo(models.DeviceInterface, {
            foreignKey: 'interfaceAId',
            targetKey: 'interfaceId',
            onDelete: 'CASCADE',
        });

        DeviceConnection.belongsTo(models.DeviceInterface, {
            foreignKey: 'interfaceBId',
            targetKey: 'interfaceId',
            onDelete: 'CASCADE',
        });
    };
    return DeviceConnection;
};
