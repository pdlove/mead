const SimpleSQL = require('./SimpleSQL');

class SNMPType {
    constructor() {
        this.typeID = 0;
        this.typeName = '';
        this.description = '';
        this.displayHint = '';
        this.status = 'current';
        this.reference = '';
        this.syntaxDataType = '';
        this.syntaxEnumeration = new Map();
    }

    async saveToDatabase(dbConfig, moduleID, objectID = 0) {
        try {
            await SimpleSQL.runProcedureScalar(dbConfig, objectID > 0 ? 'SNMP_MIB_Objects_TC_Insupd' : 'SNMP_MIB_TC_Insupd', objectID, this.description, this.displayHint, this.status, this.reference, this.syntaxDataType);
            for (let [key, value] of this.syntaxEnumeration.entries()) {
                await SimpleSQL.runProcedureScalar(dbConfig, objectID > 0 ? 'SNMP_MIB_Objects_TC_Enum_InsUpd' : 'SNMP_MIB_TC_Enum_InsUpd', this.typeID, key, value);
            }
        } catch (err) {
            console.error('Error saving SNMP type to database:', err);
        }
    }
}

module.exports = SNMPType;
