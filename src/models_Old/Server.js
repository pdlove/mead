const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
    const Server = sequelize.define('Server', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => uuidv4(), // Generate UUID for new records
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sshUser: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sshKey: { // In a real app, this should be securely managed, not stored directly
            type: DataTypes.TEXT,
            allowNull: true,
        },
        userId: { // Foreign key to User
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Server;
};