const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize) => {
    const Website = sequelize.define('Website', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => uuidv4(),
            allowNull: false,
        },
        domain: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        docRoot: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        clusterId: { // Foreign key to Cluster
            type: DataTypes.STRING,
            allowNull: true, // Can be null if not assigned to a cluster initially
        },
        port: { // For Node.js/Python apps
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        phpTemplate: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phpVersion: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phpModules: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sslType: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'None',
        },
        customSslCertPath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        customSslKeyPath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        githubUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        githubUsername: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        githubAuthType: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        githubPassword: { // Store securely in production!
            type: DataTypes.STRING,
            allowNull: true,
        },
        githubSshCert: { // Store securely in production!
            type: DataTypes.TEXT,
            allowNull: true,
        },
        githubSshCertInstalledDate: {
            type: DataTypes.STRING, // Store as ISO string
            allowNull: true,
        },
        webhookEnabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        webhookUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        webhookSecret: { // Store securely in production!
            type: DataTypes.STRING,
            allowNull: true,
        },
        userId: { // Foreign key to User
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Website;
};