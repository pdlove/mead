// This file is mainly for centralizing model imports and associations if needed elsewhere.
// The main associations are already defined in database.js for simplicity.

const { User, Server, Cluster, Website } = require('../config/database');

module.exports = {
    User,
    Server,
    Cluster,
    Website,
};