const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'ping_results.db')
});

const Host = sequelize.define('Host', {
  ip: { type: DataTypes.STRING, allowNull: false },
  alive: { type: DataTypes.BOOLEAN, allowNull: false }
});

async function init() {
  await sequelize.sync();
}

module.exports = { sequelize, Host, init };
