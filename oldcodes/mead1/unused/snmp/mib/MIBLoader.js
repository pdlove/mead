const fs = require('fs');
const path = require('path');
const MIBFile = require('./MIBFile');

class MIBLoader {
    constructor() {
        this.loadedFiles = new Map();
        this.loadedModules = new Map();
        this.loadedObjectsByName = new Map();
        this.loadedObjectsByOID = new Map();
        this.loadedTypes = new Map();
    }

    loadFiles(fileList) {
        for (const filePath of fileList) {
            const fileName = path.basename(filePath);
            if (this.loadedFiles.has(fileName)) continue;

            console.log(`Loading MIB file: ${filePath}`);

            const fileContent = fs.readFileSync(filePath, 'utf8');
            const mibFile = new MIBFile(); // Assuming MIBFile is a class you've defined elsewhere
            mibFile.loadFromStringFile(fileContent);

            this.loadedFiles.set(fileName, mibFile);

            for (const module of mibFile.modules) {
                module.environment = this;

                if (this.loadedModules.has(module.definitionName)) {
                    console.warn(`Duplicate Module Detected: ${module.moduleName}`);
                    continue;
                }

                this.loadedModules.set(module.definitionName, module);

                for (const object of Object.values(module.objects)) {
                    this.loadedObjectsByName.set(`${module.definitionName}.${object.name}`, object);
                }

                for (const type of module.tcs) {
                    this.loadedTypes.set(`${module.definitionName}.${type.typeName}`, type);
                }
            }
        }
    }

    loadFolder(folderPath) {
        const files = fs.readdirSync(folderPath);
        const mibFiles = files.map(file => path.join(folderPath, file));
        this.loadFiles(mibFiles);
    }

    parseToScalarAndTable() {
        // Implement logic to parse loaded objects into scalar and table values.
        console.log('Parsing Scalars and Tables...');
    }

    resolveOID(oid) {
        let resolvedOID = oid;

        while (!this.loadedObjectsByOID.has(resolvedOID) && resolvedOID.includes('.')) {
            resolvedOID = resolvedOID.substring(0, resolvedOID.lastIndexOf('.'));
        }

        const object = this.loadedObjectsByOID.get(resolvedOID);

        if (!object || !object.objectType) {
            return oid;
        }

        if (object.objectType === 'Scalar' || object.objectType === 'Field') {
            return `${object.name}${oid.substring(resolvedOID.length)}`;
        }

        return oid;
    }
}

module.exports = MIBLoader;
