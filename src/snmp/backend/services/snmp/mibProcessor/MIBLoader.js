const File = require('./File');
const simpleSQL = require('./SimpleSQL')

class MIBLoader {
    constructor() {
        this.myFiles = [];
    }

    async loadMIBDir(folder = 'C:/data/mibs/mib_files') {
        const sqlConfig = {
            user: 'sa',
            password: 'asdfQWER1234!@#$',
            database: 'NetworkMonitor',
            server: 'localhost',
            pool: {
              max: 10,
              min: 0,
              idleTimeoutMillis: 30000
            },
            options: {
              encrypt: true, // for azure
              trustServerCertificate: true // change to true for local dev / self-signed certs
            }
          }

        simpleSQL.addDatabase('data', 'mssql', sqlConfig)


        const fs = require('fs');
        const path = require('path');

        fs.readdirSync(folder).forEach(async (file) => {
            if (file.endsWith('.mib')) {
                const testFile = new File();
                console.log('Loading MIB file: ' + file);
                await testFile.loadFile(path.join(folder, file));
                this.myFiles.push(testFile);
            }
        });
    }
}

module.exports = MIBLoader;
