const sql = require('mssql');

class SimpleSQL {
    static databases = {};

    // Static method to add a database connection
    static async addDatabase(name, type, config) {
        if (type !== 'mssql') {
            throw new Error(`${type} is not supported yet.`);
        }

        const pool = new sql.ConnectionPool(config);
        try {
            await pool.connect();
            SimpleSQL.databases[name] = pool;
            console.log(`Database ${name} connected successfully.`);
        } catch (err) {
            console.error(`Error connecting to database ${name}:`, err);
            throw err;
        }
    }

    // Static method to run a query
    static async runQuery(databaseName, query, ...params) {
        const pool = SimpleSQL.databases[databaseName];
        if (!pool) {
            throw new Error(`Database ${databaseName} is not found.`);
        }

        let request = pool.request();

        if (params.length === 1 && typeof params[0] === 'object') {
            // If named parameters are passed
            for (let key in params[0]) {
                request = request.input(key, params[0][key]);
            }
        } else if (params.length > 0) {
            // If ordered parameters are passed
            params.forEach((param, index) => {
                request = request.input(`option${index + 1}`, param);
            });
        }

        try {
            const result = await request.query(query);
            return result.recordset;
        } catch (err) {
            console.error('Error running query:', err);
            throw err;
        }
    }

    // Static method to run a stored procedure
    static async runProcedure(databaseName, procedureName, ...params) {
        const pool = SimpleSQL.databases[databaseName];
        if (!pool) {
            throw new Error(`Database ${databaseName} is not found.`);
        }

        let request = pool.request();

        if (params.length === 1 && typeof params[0] === 'object') {
            // If named parameters are passed
            for (let key in params[0]) {
                request = request.input(key, params[0][key]);
            }
        } else if (params.length > 0) {
            // If ordered parameters are passed
            params.forEach((param, index) => {
                request = request.input(`option${index + 1}`, param);
            });
        }

        try {
            const result = await request.execute(procedureName);
            return result.recordset;
        } catch (err) {
            console.error('Error running stored procedure:', err);
            throw err;
        }
    }

    // Static method to close a specific database connection
    static async closeDatabase(databaseName) {
        const pool = SimpleSQL.databases[databaseName];
        if (!pool) {
            throw new Error(`Database ${databaseName} is not found.`);
        }

        await pool.close();
        delete SimpleSQL.databases[databaseName];
        console.log(`Database ${databaseName} connection closed.`);
    }

    // Static method to close all database connections
    static async closeAllDatabases() {
        const closePromises = Object.keys(SimpleSQL.databases).map(async (dbName) => {
            await SimpleSQL.databases[dbName].close();
        });

        await Promise.all(closePromises);
        SimpleSQL.databases = {};
        console.log('All database connections closed.');
    }
}

module.exports = SimpleSQL;
