const SimpleSQL = require('./SimpleSQL');

class Trap {
    constructor() {
        this.trapID = 0;
        this.trapName = '';
        this.objectID = '';
        this.description = '';
        this.enterprise = '';
        this.variables = [];
    }

    async saveToDatabase(dbConfig, moduleID) {
        try {
            this.trapID = await SimpleSQL.runProcedureScalar(dbConfig, 'SNMP_MIB_Traps_Insupd', this.trapID, moduleID, this.trapName, this.objectID, this.description, this.enterprise);
        } catch (err) {
            console.error('Error saving trap to database:', err);
        }
    }
}

module.exports = Trap;
