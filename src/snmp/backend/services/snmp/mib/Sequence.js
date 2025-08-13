class Sequence {
    constructor({
        name = "",
        oid = "",
        description = "",
        fields = []
    } = {}) {
        this.name = name;
        this.oid = oid;
        this.description = description;
        this.fields = fields; // Array of field definitions
    }

    addField(field) {
        this.fields.push(field);
    }

    loadFromRow(row) {
        this.name = row.Name;
        this.oid = row.OID;
        this.description = row.Description;
        // Load fields if available in the row
        if (row.Fields) {
            this.fields = row.Fields.map(fieldRow => new SequenceField(fieldRow));
        }
    }

    toString() {
        return `${this.name} (${this.oid}): ${this.description}`;
    }
}

class SequenceField {
    constructor({
        name = "",
        dataType = "",
        description = ""
    } = {}) {
        this.name = name;
        this.dataType = dataType;
        this.description = description;
    }

    loadFromRow(row) {
        this.name = row.Name;
        this.dataType = row.DataType;
        this.description = row.Description;
    }

    toString() {
        return `${this.name} (${this.dataType}): ${this.description}`;
    }
}

module.exports = { Sequence, SequenceField };
