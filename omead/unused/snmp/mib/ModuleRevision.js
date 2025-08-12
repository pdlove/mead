class ModuleRevision {
    constructor(date = null, description = "") {
        this.date = date;
        this.description = description;
    }

    loadFromRow(row) {
        this.date = new Date(row.RevisionDate);
        this.description = row.Description;
    }

    toString() {
        return `${this.date.toISOString().split('T')[0]}: ${this.description}`;
    }

    static fromRow(row) {
        const revision = new ModuleRevision();
        revision.loadFromRow(row);
        return revision;
    }
}

module.exports = ModuleRevision;
