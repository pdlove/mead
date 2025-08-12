class ModuleRevision {
    constructor(revision, description) {
        this.revision = revision || new Date();
        this.description = description || '';
    }
}

module.exports = ModuleRevision;
