const { Sequelize, DataTypes, Model } = require('sequelize');
const config = require('../config/config.json');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    dialect: dbConfig.dialect
});

class Syslog extends Model {}

Syslog.init({
    sourceIP: { type: DataTypes.STRING },
    logTime: { type: DataTypes.DATE },
    message: { type: DataTypes.TEXT }
}, { sequelize, modelName: 'Syslog' });

module.exports = { sequelize, Syslog };