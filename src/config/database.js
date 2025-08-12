const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'), // Path to your SQLite database file
    logging: false, // Set to true to see SQL queries in console
});


module.exports = {
    sequelize,
};