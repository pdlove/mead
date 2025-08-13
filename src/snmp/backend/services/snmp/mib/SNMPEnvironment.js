const MIBFile = require('./MIBFile');

class SNMPEnvironment {
    constructor() {
        this.loadedFiles = new Map();
        this.loadedModules = new Map();
        this.loadedObjectsByName = new Map();
        this.loadedObjectsByOID = new Map();
    }

    loadFiles(filePaths) {
        filePaths.forEach(filePath => {
            if (this.loadedFiles.has(filePath)) return;

            console.log(`Loading file: ${filePath}`);
            const mibFile = new MIBFile();
            mibFile.loadFile(filePath);

            this.loadedFiles.set(filePath, mibFile);

            mibFile.modules.forEach(module => {
                if (this.loadedModules.has(module.definitionName)) {
                    console.warn(`Duplicate module detected: ${module.definitionName}`);
                    return;
                }

                this.loadedModules.set(module.definitionName, module);

                Object.values(module.objects).forEach(object => {
                    this.loadedObjectsByName.set(`${module.definitionName}.${object.name}`, object);
                    this.loadedObjectsByOID.set(object.oid, object);
                });
            });
        });
    }

    resolveOID(oid) {
        let resolvedOID = oid;

        while (!this.loadedObjectsByOID.has(resolvedOID) && resolvedOID.includes('.')) {
            resolvedOID = resolvedOID.substring(0, resolvedOID.lastIndexOf('.'));
        }

        const object = this.loadedObjectsByOID.get(resolvedOID);
        if (!object) return oid;

        if (['Scalar', 'Field'].includes(object.objectType)) {
            return `${object.name}${oid.substring(resolvedOID.length)}`;
        }

        return oid;
    }

    parseToScalarAndTable() {
        console.log('Parsing to Scalars and Tables...');
        // Implement parsing logic to separate scalar and table values.
    }
}

module.exports = SNMPEnvironment;
