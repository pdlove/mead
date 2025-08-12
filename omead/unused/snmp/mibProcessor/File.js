const SimpleSQL = require('./SimpleSQL');  // Ensure SimpleSQL.js is in the same directory
const BaseModule = require('./BaseModule');  // Ensure BaseModule.js is in the same directory

class File {
    fileID=0;
    mibFileName='unknown.mib';
    mibFileContents=null;
    uploadTime = new Date();
    isProcessed = false;
    isErrored = false;
    modules = [];
    rawData = [];

    constructor() {        
    }

    // Load the file from a string (simulate loading MIB file)
    loadFromStringFile(fileContent) {
        this.mibFileContents = fileContent;
        this.compileFile();
    }

    // Load the file from disk (node.js filesystem)
    async loadFile(filePath) {
        const fs = require('fs');
        this.mibFileName = require('path').basename(filePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.loadFromStringFile(fileContent);
    }

    // Compile the file by processing its contents (similar to breakItDownNow method in VB)
    compileFile() {
        this.breakItDownNow();  // Break the file down into manageable parts
        this.decodeFile();  // Decode the content and load it into BaseModule instances
    }

    // Save the file and its modules to the database
    async saveToDatabase(dbConfig) {
        try {
            await SimpleSQL.runProcedure("data", 'snmp.mibFiles_InsUpd', this.fileID, this.mibFileName, this.uploadTime, this.isProcessed, this.isErrored, this.mibFileContents);

            // Save each module to the database
            for (let module of this.modules) {
                await module.saveToDatabase(dbConfig, false);
            }
        } catch (err) {
            console.error('Error saving file to database:', err);
        }
    }

    // Load the file and its associated modules from the database
    async loadFromDatabase(dbConfig, fileID) {
        try {
            const myTable = await SimpleSQL.runProcedure("data", "snmp.mibFiles_GetContents", { fileID });
            if (myTable.length > 0) {
                this.loadFromRow(myTable[0]);
            }
        } catch (err) {
            console.error('Error loading file from database:', err);
        }
    }

    // Helper function to load the file object from a row (from SQL)
    async loadFromRow(row) {
        this.fileID = row.fileID;
        this.mibFileName = row.mibFileName;
        this.mibFileContents = row.mibFileContents.replace(/\r\n/g, '\r').replace(/\n/g, '\r');  // Standardize line endings
        this.uploadTime = row.uploadTime;
        this.isProcessed = row.isProcessed;
        this.isErrored = row.isErrored;

        // Load associated modules
        this.modules = [];
        const relatedModules = await SimpleSQL.runProcedure('data', 'snmp.mibModules_Get', { fileID: this.fileID });
        relatedModules.forEach(row => {
            this.modules.push(new BaseModule(row));
        });
    }

    // Break the file content into parts (similar to breakItDownNow in VB)
    breakItDownNow() {
        this.mibFileContents = this.mibFileContents.replace(/\r\n/g, '\r').replace(/\n/g, '\r');
        this.mibFileContents = this.mibFileContents.replace(/\t/g, ' ').replace(/\s{2,}/g, ' ');  // Remove extra spaces and tabs

        const lines = this.mibFileContents.split('\r');
        let inQuote = false;
        let inComment = false;
        let lastWord = '';

        for (let line of lines) {
            if (inComment) {
                lastWord = '';  // Ignore comments
                inComment = false;
            } else if (inQuote) {
                lastWord += '\r';
            } else {
                lastWord = this.addWord(lastWord);
            }

            for (let char of line) {
                if (inComment) {
                    lastWord += char;
                } else if (inQuote) {
                    lastWord += char;
                    if (char === '"') {  // Ending quote
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

                    if (lastWord === '--') inComment = true;  // Start of comment
                }
            }
        }

        this.rawData.push('');  // Add a final empty entry to ensure it's complete
    }

    // Check if a character is a grouping symbol
    isGrouping(char) {
        return ['{', '}', '(', ')'].includes(char);
    }

    // Process each word and handle special cases
    addWord(word) {
        word = word.trim();
        if (!word) return '';

        if (word.includes('::=')) {
            const parts = word.split('::=');
            this.rawData.push(parts[0].trim());
            this.rawData.push('::=');
            word = parts[1].trim();
        } else {
            this.rawData.push(word);
        }
        
        return '';
    }

    // Decode the file content into BaseModule instances (similar to decodeFile in VB)
    decodeFile() {
        let currentLine = 0;
        while (currentLine < this.rawData.length - 1) {
            if (this.rawData[currentLine].toUpperCase() === 'DEFINITIONS') {
                const newModule = new BaseModule();
                newModule.sourceFileID = this.fileID;
                newModule.sourceText = this.mibFileContents;
                currentLine = newModule.loadFromSymbolList(this.rawData, currentLine);
                this.modules.push(newModule);
            }
            currentLine++;
        }
    }
}

module.exports = File;
