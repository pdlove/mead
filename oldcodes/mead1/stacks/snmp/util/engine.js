const crypto = require ("crypto");
const { Buffer } = require ("buffer");

class Engine {
    constructor(engineID, engineBoots, engineTime) {
        if (engineID) {
            if (!(engineID instanceof Buffer)) {
                engineID = engineID.replace('0x', '');
                this.engineID = Buffer.from((engineID.toString().length % 2 == 1 ? '0' : '') + engineID.toString(), 'hex');
            } else {
                this.engineID = engineID;
            }
        } else {
            this.generateEngineID();
        }
        this.engineBoots = 0;
        this.engineTime = 10;
    }

    generateEngineID = function () {
        // generate a 17-byte engine ID in the following format:
        // 0x80 | 0x00B983 (enterprise OID) | 0x80 (enterprise-specific format) | 12 bytes of random
        this.engineID = Buffer.alloc(17);
        this.engineID.fill('8000B98380', 'hex', 0, 5);
        this.engineID.fill(crypto.randomBytes(12), 5, 17, 'hex');
    }
}
module.exports = { Engine };