const SimpleSQL = require('./SimpleSQL'); // Make sure SimpleSQL.js is in the same directory
const ModuleRevision = require('./ModuleRevision'); // Assuming ModuleRevision.js exists
const BaseObject = require('./BaseObject'); // Assuming BaseObject.js exists
const SNMPType = require('./SNMPType'); // Assuming SNMPType.js exists
const Trap = require('./Trap'); // Assuming Trap.js exists
const Sequence = require('./Sequence'); // Assuming Sequence.js exists

class BaseModule {
    constructor() {
        this.moduleID = 0;
        this.sourceFileID = 0;
        this.sourceText = '';
        this.definitionName = '';
        this.moduleName = '';
        this.lastUpdated = new Date();
        this.organization = '';
        this.contactInfo = '';
        this.description = '';
        this.isFullyResolved = false;
        this.importTime = new Date();
        this.moduleImports = new Map();  // Key: sourceModuleName, Value: Array of sourceObjects
        this.revisions = [];
        this.objects = new Map();  // Key: object name, Value: BaseObject
        this.tcs = new Map();  // Key: SNMPType name, Value: SNMPType
        this.sequences = [];
        this.trapTypes = [];
        this.moduleObject = null;
    }

    // Load the module data from the database
    async loadFromDatabase(dbConfig, moduleID) {
        try {
            const result = await SimpleSQL.runProcedure('snmp',  'SNMP_MIB_Modules_GetByID', moduleID);
            if (result.length > 0) {
                this.loadFromRow(result[0]);
            }
        } catch (err) {
            console.error('Error loading module from database:', err);
        }
    }

    // Helper function to load the module from a database row
    loadFromRow(row) {
        this.moduleID = row.ModuleID;
        this.sourceFileID = row.SourceFileID;
        this.sourceText = row.SourceText;
        this.definitionName = row.DefinitionName;
        this.moduleName = row.ModuleName;
        this.lastUpdated = row.LastUpdated;
        this.organization = row.Organization;
        this.contactInfo = row.ContactInfo;
        this.description = row.Description;
        this.isFullyResolved = row.IsFullyResolved;
        this.importTime = row.ImportTime;
    }

    // Save the module and its associated objects, sequences, and traps to the database
    async saveToDatabase(dbConfig) {
        try {
            this.moduleID = await SimpleSQL.runProcedureScalar(dbConfig, 'SNMP_MIB_Modules_InsUpd',
                this.moduleID,
                this.sourceFileID,
                this.sourceText,
                this.definitionName,
                this.moduleName,
                this.lastUpdated,
                this.organization,
                this.contactInfo,
                this.description,
                this.isFullyResolved,
                this.importTime
            );

            // Clear existing imports before inserting new ones
            await SimpleSQL.runProcedureNonQuery(dbConfig, 'SNMP_MIB_Modules_Imports_Clear', this.moduleID);

            // Save imports
            for (let [sourceModuleName, sourceObjects] of this.moduleImports.entries()) {
                for (let sourceObjectName of sourceObjects) {
                    await SimpleSQL.runProcedureScalar(dbConfig, 'SNMP_MIB_Modules_Imports_InsUpd', this.moduleID, sourceModuleName, sourceObjectName);
                }
            }

            // Save revisions
            for (let revision of this.revisions) {
                await SimpleSQL.runProcedureScalar(dbConfig, 'SNMP_MIB_Module_Revisions_InsUpd', this.moduleID, revision.revision, revision.description);
            }

            // Save sequences
            for (let sequence of this.sequences) {
                await sequence.saveToDatabase(dbConfig, this.moduleID);
            }

            // Save trap types
            for (let trap of this.trapTypes) {
                await trap.saveToDatabase(dbConfig, this.moduleID);
            }

            // Save objects
            for (let object of this.objects.values()) {
                await object.saveToDatabase(dbConfig, this.moduleID);
            }
        } catch (err) {
            console.error('Error saving module to database:', err);
        }
    }

    // Load symbols from raw data (similar to VB's LoadFromSymbolList)
    loadFromSymbolList(symbolList, startIndex) {
        let currentIndex = startIndex;

        while (currentIndex < symbolList.length) {
            let symbol = symbolList[currentIndex].toUpperCase();

            // Handle different sections of the MIB file
            switch (symbol) {
                case 'MODULE-IDENTITY':
                    this.moduleObject = new BaseObject();
                    currentIndex = this.moduleObject.loadFromMIB(symbolList, currentIndex, symbolList.length);
                    this.objects.set(this.moduleObject.name, this.moduleObject);
                    break;
                case 'OBJECT-TYPE':
                case 'OBJECT-IDENTITY':
                case 'NOTIFICATION-TYPE':
                    { let newObject = new BaseObject();
                    currentIndex = newObject.loadFromMIB(symbolList, currentIndex, symbolList.length);
                    this.objects.set(newObject.name, newObject);
                    break; }
                case 'TEXTUAL-CONVENTION':
                    { const newSNMPType = new SNMPType();
                    currentIndex = newSNMPType.loadFromMIB(symbolList, currentIndex);
                    this.tcs.set(newSNMPType.typeName, newSNMPType);
                    break; }
                case 'TRAP-TYPE':
                    { const newTrap = new Trap();
                    currentIndex = newTrap.loadFromMIB(symbolList, currentIndex, symbolList.length);
                    this.trapTypes.push(newTrap);
                    break; }
                case 'SEQUENCE':
                    { const newSequence = new Sequence();
                    currentIndex = newSequence.loadFromMIB(symbolList, currentIndex);
                    this.sequences.push(newSequence);
                    break; }
                default:
                    // Skip any unrecognized sections
                    currentIndex++;
                    break;
            }
        }

        return currentIndex;
    }

    // Other utility methods...
    addRevision(revision, description) {
        this.revisions.push(new ModuleRevision(revision, description));
    }

    addObject(baseObject) {
        this.objects.set(baseObject.name, baseObject);
    }

    addTrap(trap) {
        this.trapTypes.push(trap);
    }

    addSequence(sequence) {
        this.sequences.push(sequence);
    }

    addType(snmpType) {
        this.tcs.set(snmpType.typeName, snmpType);
    }
}

module.exports = BaseModule;
