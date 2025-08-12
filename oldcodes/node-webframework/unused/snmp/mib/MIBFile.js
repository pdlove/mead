const path = require('path');
const fs = require('fs');

class MIBFile {
    constructor(fileID = 0, dataRow = null) {
        this.fileID = fileID;
        this.fileName = '';
        this.fileText = '';
        this.uploadTime = new Date();
        this.isProcessed = false;
        this.isErrored = false;
        this.rawData = [];
        this.modules = [];

        if (dataRow) {
            this.loadFromRow(dataRow);
        } else if (fileID) {
            const dataTable = SimpleSQL.runProcedureGetDataTable('DB', 'snmp.mibFiles_GetContents', fileID);
            if (dataTable.length > 0) {
                this.loadFromRow(dataTable[0]);
            }
        }
    }

    loadFromRow(row) {
        this.fileID = row.FileID;
        this.fileName = row.MIBFileName;
        this.fileText = row.MIBFileContents.replace(/\r\n|\n/g, '\r'); // Standardize the newline
        this.uploadTime = row.UploadTime;
        this.isProcessed = row.isProcessed;
        this.isErrored = row.isErrored;
        this.modules = [];

        // Load related modules
        const dataTable = SimpleSQL.runProcedureGetDataTable('DB', 'snmp.mibModules_Get', this.fileID, null, null);
        for (const dataRow of dataTable) {
            this.modules.push(new BaseModule(dataRow));
        }
    }

    saveToDatabase() {
        const resultTable = SimpleSQL.runProcedureGetDataTable('DB', 'snmp.mibFiles_InsUpd', this.fileID, this.fileName, this.uploadTime, this.isProcessed, this.isErrored, this.fileText);
        for (const module of this.modules) {
            module.saveToDatabase(false);
        }
    }

    compileFile() {
        this.breakItDownNow();
        this.decodeFile();
    }

    loadFile(filePath) {
        this.fileName = path.basename(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        this.loadFromStringFile(fileContent);
    }

    loadFromStringFile(content) {
        this.fileText = content;
        this.compileFile();
    }

    breakItDownNow() {
        this.fileText = this.fileText.replace(/\r\n|\n/g, '\r');

        while (this.fileText.includes('\r\r')) {
            this.fileText = this.fileText.replace(/\r\r/g, '\r');
        }

        this.fileText = this.fileText.replace(/\t/g, ' ');
        while (this.fileText.includes('  ')) {
            this.fileText = this.fileText.replace(/  /g, ' ');
        }

        const lines = this.fileText.split('\r');
        let inQuote = false;
        let inComment = false;
        let lastWord = '';

        for (const line of lines) {
            for (let char of line) {
                if (inComment) {
                    lastWord = '';
                    inComment = false;
                } else if (inQuote) {
                    lastWord += char;
                    if (char === '"') {
                        lastWord = this.addWord(lastWord);
                        inQuote = false;
                    }
                } else {
                    if (char === ' ') {
                        lastWord = this.addWord(lastWord);
                    } else if (char === '"') {
                        lastWord = this.addWord(lastWord);
                        lastWord += char;
                        inQuote = true;
                    } else if (this.isGrouping(char)) {
                        lastWord = this.addWord(lastWord);
                        lastWord = this.addWord(char);
                    } else {
                        lastWord += char;
                    }

                    if (lastWord === '--') {
                        inComment = true;
                    }
                }
            }
        }

        this.rawData.push('');
    }

    isGrouping(char) {
        return ['{', '(', ')', '}'].includes(char);
    }

    addWord(word) {
        word = word.trim();
        if (!word) return '';

        let endWord = '';
        if (!word.startsWith('"') && word.includes('::=')) {
            endWord = word.substring(word.indexOf('::='));
            word = word.substring(0, word.indexOf('::='));
        }

        if (["TYPE NOTATION", "VALUE NOTATION", "SEQUENCE OF", "OBJECT IDENTIFIER", "OCTET STRING"].includes(`${this.lastWordAdded} ${word.toUpperCase()}`)) {
            this.rawData[this.rawData.length - 1] += ` ${word}`;
        } else {
            this.rawData.push(word);
        }

        this.lastWordAdded = word.toUpperCase();
        if (endWord) {
            this.lastWordAdded = endWord.toUpperCase();
            this.rawData.push(endWord);
        }

        return '';
    }

    decodeFile() {
        let currentLine = 0;
        while (currentLine < this.rawData.length - 1) {
            if (this.rawData[currentLine].toUpperCase() === 'DEFINITIONS') {
                const module = new BaseModule({ sourceFileID: this.fileID, sourceText: this.fileText });
                currentLine = module.loadFromSymbolList(this.rawData, currentLine);
                this.modules.push(module);
            }
            currentLine++;
        }
    }
}

module.exports = MIBFile;
