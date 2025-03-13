const SimpleSQL = require('./SimpleSQL'); // Ensure SimpleSQL.js is in the same directory
const SNMPType = require('./SNMPType'); // Ensure SNMPType.js is in the same directory

const supportedTypes = ["NOTIFICATION-GROUP", "NOTIFICATION-TYPE", "OBJECT-GROUP", "OBJECT-IDENTITY", "OBJECT-TYPE"]
const statusEnum = 
    { "isCurrent": 0, 0: "isCurrent",
      "isDeprecated": 1, 1: "isDeprecated",
      "isObsolete": 2, 2: "isObsolete",
      "isMandatory": 3, 3: "isMandatory",
      "isOptional": 4, 4: "isOptional" }
const accessEnum = 
    { "not_accessible": 0, 0: "not_accessible",
      "accessible_for_notify" : 1, 1: "accessible_for_notify",
      "read_only" : 2, 2: "read_only",
      "read_write" : 3, 3: "read_write",
      "read_create" : 4, 4: "read_create" }


class BaseObject {
    objectID = 0;
    name = '';
    description = '';
    status = 'current'; // Possible values: 'current', 'deprecated', 'obsolete', 'mandatory', 'optional'
    reference = '';
    childObjectNames = [];
    maxAccess = 'not-accessible'; // Possible values: 'not-accessible', 'accessible-for-notify', 'read-only', 'read-write', 'read-create'
    units = '';
    indexes = [];
    defVal = '';
    objectType = '';
    objectIDOriginal = '';
    objectOID = '';
    parentObjectID = '';
    childObjects = [];
    processed = false;
    declaredType = null;  // Declared SNMPType
    resolvedType = null;  // Resolved SNMPType

    
    constructor() {}

    // Save the object to the database
    async saveToDatabase(moduleID) {
        try {
            let declaredTypeSyntax = this.declaredType ? this.declaredType.syntaxDataType : null;

            this.objectID = await SimpleSQL.runProcedure("data", "snmp.mibObjects_InsUpd",
                { objectID: this.objectID,
                  moduleID,
                  objectName: this.name.trim(),
                  description: this.description.trim(),
                  status: this.status,
                  reference: this.reference.trim(),
                  maxAccess: this.maxAccess,
                  units: this.units.trim(),
                  defaultValue: this.defVal.trim(),
                  declaredTypeSyntax: declaredTypeSyntax,
                  objectIDOriginal: this.objectIDOriginal.trim() }
            );

            // Save declared type if it exists
            if (this.declaredType) {
                await this.declaredType.saveToDatabase(moduleID, this.objectID);
            }
        } catch (err) {
            console.error('Error saving BaseObject to database:', err);
        }
    }

    // Load the object from a database row
    loadFromRow(row) {
        this.objectID = row.objectID;
        this.name = row.name;
        this.description = row.description;
        this.status = row.status;
        this.reference = row.reference;
        this.maxAccess = row.maxAccess;
        this.units = row.units;
        this.defVal = row.defVal;
        this.objectType = row.objectType;
        this.objectIDOriginal = row.objectIDOriginal;
        this.objectOID = row.objectOID;
        this.parentObjectID = row.parentObjectID;
    }


    // Load object from MIB symbols (similar to loadFromMIB in VB)
    loadFromMIB(symbols, start, last) {
        
        let i = start;

        this.name = symbols[start - 1];  // The name is typically before the symbol "OBJECT-TYPE"

        while (i < last) {
            const symbol = symbols[i].toUpperCase();

            switch (symbol) {
                case 'STATUS':
                    i++;
                    this.status = this.parseStatus(symbols[i]);
                    break;

                case 'DESCRIPTION':
                    i++;
                    this.description = symbols[i].replace(/"/g, '').replace(/\s+/g, ' ').trim();  // Clean up the description text
                    break;

                case 'REFERENCE':
                    i++;
                    this.reference = symbols[i];
                    break;

                case 'OBJECTS':
                case 'NOTIFICATIONS':
                    i++;
                    this.parseChildObjects(symbols[i]);
                    break;

                case '::=':
                    i++;
                    this.objectIDOriginal = this.parseOID(symbols, i);
                    break;

                case 'UNITS':
                    i++;
                    this.units = symbols[i];
                    break;

                case 'MAX-ACCESS':
                case 'ACCESS':
                    i++;
                    this.maxAccess = this.parseAccess(symbols[i]);
                    break;

                case 'INDEX':
                case 'AUGMENTS':
                    i++;
                    this.indexes = this.parseIndexes(symbols, i);
                    break;

                case 'DEFVAL':
                    i++;
                    this.defVal = this.parseDefVal(symbols, i);
                    break;

                case 'SYNTAX':
                    i++;
                    this.declaredType = new SNMPType();
                    i = this.declaredType.loadSyntax(symbols, i);  // Parse the type information
                    break;

                default:
                    console.warn(`Unknown symbol: ${symbol} in BaseObject.`);
                    break;
            }

            i++;
        }

        return i;
    }

    // Parse the STATUS field (current, deprecated, obsolete, etc.)
    parseStatus(symbol) {
        const statusMap = {
            'CURRENT': 'current',
            'DEPRECATED': 'deprecated',
            'OBSOLETE': 'obsolete',
            'MANDATORY': 'mandatory',
            'OPTIONAL': 'optional'
        };

        return statusMap[symbol.toUpperCase()] || 'current';
    }

    // Parse the OID field
    parseOID(symbols, i) {
        let oid = symbols[i];

        // Handle multi-part OIDs, concatenating parts until balanced parentheses
        while (oid.replace(/\(/g, '').length !== oid.replace(/\)/g, '').length ||
            oid.replace(/\{/g, '').length !== oid.replace(/\}/g, '').length) {
            i++;
            oid += ` ${symbols[i]}`;
        }

        return oid.replace(/[{}]/g, '').trim();  // Remove curly braces
    }

    // Parse the MAX-ACCESS or ACCESS field
    parseAccess(symbol) {
        const accessMap = {
            'NOT-ACCESSIBLE': 'not-accessible',
            'ACCESSIBLE-FOR-NOTIFY': 'accessible-for-notify',
            'READ-ONLY': 'read-only',
            'READ-WRITE': 'read-write',
            'READ-CREATE': 'read-create'
        };

        return accessMap[symbol.toUpperCase()] || 'not-accessible';
    }

    // Parse the list of indexes
    parseIndexes(symbols, i) {
        let indexes = [];

        // Handle multi-part index lists enclosed in braces
        let indexString = symbols[i].replace('{', '').replace('}', '');
        while (symbols[i] && symbols[i].includes('{')) {
            i++;
            indexString += ` ${symbols[i]}`;
        }

        indexes = indexString.split(',').map(index => index.trim());

        return indexes;
    }

    // Parse the DEFVAL field
    parseDefVal(symbols, i) {
        let defVal = symbols[i];

        // Handle multi-part DEFVAL enclosed in braces
        if (defVal.includes('{')) {
            let nestLevel = 1;
            while (nestLevel > 0) {
                i++;
                defVal += ` ${symbols[i]}`;
                if (symbols[i] === '{') nestLevel++;
                if (symbols[i] === '}') nestLevel--;
            }
        }

        return defVal.replace(/[{}]/g, '').trim();  // Remove braces
    }

    // Parse child object names from OBJECTS or NOTIFICATIONS
    parseChildObjects(symbol) {
        let childObjects = symbol.replace(/[{}]/g, '').split(',');
        this.childObjectNames = childObjects.map(obj => obj.trim());
    }

    // Resolve the base type for the object
    determineBaseType() {
        if (this.declaredType) {
            this.resolvedType = this.declaredType;  // For now, assume resolvedType is the same as declaredType
        }
    }
}

module.exports = BaseObject;
