const SimpleSQL = require('./SimpleSQL');

class Sequence {
    constructor() {
        this.sequenceID = 0;
        this.name = '';
        this.description = '';
        this.elements = [];
        this.moduleID = 0;
    }

    // Load the sequence from a database row
    loadFromRow(row) {
        this.sequenceID = row.SequenceID;
        this.name = row.Name;
        this.description = row.Description;
        this.moduleID = row.ModuleID;
    }

    // Save the sequence to the database
    async saveToDatabase(dbConfig, moduleID) {
        try {
            this.moduleID = moduleID;
            this.sequenceID = await SimpleSQL.runProcedureScalar(dbConfig, 'SNMP_MIB_Sequences_InsUpd',
                this.sequenceID,
                this.moduleID,
                this.name.trim(),
                this.description.trim()
            );

            // Save elements
            for (const element of this.elements) {
                await this.saveElementToDatabase(dbConfig, element);
            }

        } catch (err) {
            console.error('Error saving sequence to database:', err);
        }
    }

    // Save each sequence element to the database
    async saveElementToDatabase(dbConfig, element) {
        try {
            await SimpleSQL.runProcedureNonQuery(dbConfig, 'SNMP_MIB_Sequence_Elements_InsUpd',
                this.sequenceID,
                element.name.trim(),
                element.dataType.trim(),
                element.description.trim()
            );
        } catch (err) {
            console.error('Error saving sequence element to database:', err);
        }
    }

    // Load sequence from MIB symbols
    loadFromMIB(symbols, start, last) {
        let i = start;

        // Load sequence name
        this.name = symbols[start - 1];  // Sequence name is typically before the SEQUENCE keyword

        while (i < last) {
            const symbol = symbols[i].toUpperCase();

            // Identify the sequence structure
            switch (symbol) {
                case 'SEQUENCE':
                    i++;
                    if (symbols[i] === '{') i++;  // Skip the opening brace
                    break;
                case '}':
                    return i;  // Return when the closing brace of the SEQUENCE is encountered
                default:
                    // Parse each sequence element
                    { const elementName = symbols[i++];
                    const elementType = symbols[i++];
                    this.elements.push({
                        name: elementName,
                        dataType: elementType,
                        description: ''  // Optional: Add further processing to capture descriptions
                    });
                    break; }
            }
        }

        return i;
    }
}

module.exports = Sequence;
