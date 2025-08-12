const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.STRING, // Use STRING for user IDs (like Firebase UIDs)
            primaryKey: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: { // In a real app, store hashed passwords!
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'website_admin', // Default role
        },
        // Store assigned clusters/websites as JSON strings
        assignedClusters: {
            type: DataTypes.TEXT, // Store as JSON string
            defaultValue: '[]',
            get() {
                const rawValue = this.getDataValue('assignedClusters');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('assignedClusters', JSON.stringify(value));
            }
        },
        assignedWebsites: {
            type: DataTypes.TEXT, // Store as JSON string
            defaultValue: '[]',
            get() {
                const rawValue = this.getDataValue('assignedWebsites');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('assignedWebsites', JSON.stringify(value));
            }
        }
    });
    return User;
};