//Used for Control loading
const path = require('path');
const fs = require('fs');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);



class hotspringGlobal {
    static modules = {};
    static rootFolder = path.resolve(__dirname, '../');

    configuration = {};
    jobs = {};
    models = {};
    routes = {};

    loadModule(path) {
        
    }

  
  
}
global.hotspringGlobal = hotspringGlobal;
exports = {hotspringGlobal};