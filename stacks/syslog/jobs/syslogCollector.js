const { HotspringJob } = require('hotspring-framework');

class SyslogCollector extends HotspringJob {
    static jobTemplateName = 'syslogCollector';
    static jobTemplateType = 'service';
    static description = 'Collects Syslog Data';

    static defaultConfiguration = {
        instanceName: {type: 'string', default: 'general', description: "The name of the instance"},
        listenPort: {type: 'number', default: 514, description: "The port to listen for syslog messages"},
        isTCP: {type: 'boolean', default: false, description: "Use TCP instead of UDP"},
        autoCreateDevice: {type: 'boolean', default: true, description: "Automatically create a syslog source device if it does not exist"},
        logFlushInterval: {type: 'number', default: 15, description: "The interval in seconds to flush logs to the database or file"},
        logDatabaseRotateInterval: {type: 'number', default: 0, description: "The interval in seconds to rotate logs in the database. 0 to disable"},
        logFileRotateInterval: {type: 'number', default: 0, description: "The interval in seconds to rotate logs in the file. 0 to disable"},
        logFilePath: {type: 'string', default: '', description: "The path to a text file to use for testing"},
        logFileName: {type: 'string', default: 'syslog', description: "The name to use for the text file"},
    }

    
    static supportsPause = false;
    static supportsCancel = false;
    static supportsUndo = false;

    currentBatchID = 0;
    currentLine = 1;
    rotateInProgress = false;
    queuedMessagesByHost = {};

    syslogProcessors = {};


    constructor(config) {
        super(config);
    }
    async runJob(config) {
        //I'm not sure it makes sense to pass a config here.
        const { Syslogd }  = require('../syslog');
        const server = new Syslogd();
        server.startListening();
        await this.nextBatch(); //Cycle the batch. This should clean up any old batches and start a new one.
        server.on('message', async (value) => {
            //Wait for the rotation to complete if it is in progress. This goes quick.
            while (this.rotateInProgress) {                
                await new Promise((resolve) => setTimeout(resolve, 10));
            }
            //If the host is not in the message queue, add it.
            if (!this.queuedMessagesByHost[value.sourceIP]) 
                this.queuedMessagesByHost[value.sourceIP] = [];
            //Add the message to the queue.
            this.queuedMessagesByHost[value.sourceIP].push(value);
        });
        server.on('error', (err) => {
            console.error(err);
        });

        this.flushTrigger = setInterval(this.flushLogs.bind(this), this.config.logFlushInterval * 1000);

        console.log('Syslog Collector Started with logFlushInterval:', this.config.logFlushInterval);
    }
    async flushLogs() {
        //This commits the logs to the database or file under the current batch.
        //If there is no current batch, it starts a new one.

        //First rotate the log.
        this.rotateInProgress = true;
        let processingQueue = this.queuedMessagesByHost;
        this.queuedMessagesByHost = {};
        this.rotateInProgress = false;

        //Check if we need to rotate the batch.

        //Upload the information to the current batch. This does it by host so that it can also process the data if possible.
        let hosts = {};
        console.log("Flush Start");
        //Loop through the hosts listed in the processing Queue.
        for (const host in processingQueue) {
            //If the host is not in the host list, add it.
            hosts[host] = {};
            //Get the Host parameters from the model. SyslogProcessor and SyslogProcessorConfig. (These could be arrays)
            //If the host is not in the model, create it with the Generic Processor.

            //Loop through the messages for the host.
            let entries = [];
            let messages = [];
            let data = [];
            for (const message of processingQueue[host]) {
                //For each message, process it with the processor if one is defined and exists on this agent.
                entries.push({
                    batchID: this.currentBatchID,
                    lineID: this.currentLine++,
                    sourceIP: message.sourceIP,
                    facility: message.facility,
                    severity: message.severity,
                    time: message.time,
                    message: message.msg,
                    state: 2 //Unprocessed
                });
                
                //If successfully processed, set the logEntry to processed.
                //This will need modification when we implement distributed agents.
                //console.log(message);
                //Upload the message to the database using logentry sequelize Model.
                //Process the message with the processor.
                //Flag the message as processed.
            }
            //Bulk Upload the Syslog Entries
            const logEntryModel = await global.hotspring.stacks['syslog'].models['LogEntry'];                
            await logEntryModel.sequelizeObject.bulkCreate(entries, { fields: ['batchID', 'lineID', 'sourceIP', 'facility', 'severity', 'time', 'state'] });

            const logEntryMessageModel = await global.hotspring.stacks['syslog'].models['LogEntryMessage'];                
            await logEntryMessageModel.sequelizeObject.bulkCreate(entries, { fields: ['batchID', 'lineID', 'message'] });

            console.log('Host:', host, 'Messages:', processingQueue[host].length, ' added to Database.');
        }
        console.log("Flush Stop");
    }

    async nextBatch() {
        //The logger should move to the next batch after X seconds or by a trigger in the database.
        if (this.currentBatchID > 0) {
            // Update the current batch state to "Unprocessed"
            await this.updateBatchState(this.currentBatchID, 2, {
                totalLines: this.currentLine-1,
                batchEndTime: new Date()
            });
        }

        // Start a new batch
        const newBatch = await this.createLogBatch();
        this.currentBatchID = newBatch.batchID;
        this.currentLine = 1;        
        newBatch.state = 1; // Active
        newBatch.sourceDeviceID = 0; // Will be updated later to use our agent id
        newBatch.batchStartTime = new Date();

    }

    async updateBatchState(batchID, state, updates) {
        // Update the batch state in the database
        const model = await global.hotspring.stacks['syslog'].models['LogBatch'];
        await model.updateObject(batchID, {
            state: state,
            ...updates
        });
    }

    async createLogBatch() {
        // Create a new log batch record in the database
        const model = await global.hotspring.stacks['syslog'].models['LogBatch'];
        const newBatch = await model.addObject({
            state: 1, // Active
            collectorID: 0, // Will be updated later to use our agent id
            collectorIP: '127.0.0.1', // Will be updated later to use our agent IP
            batchStartTime: new Date()
        });
        return newBatch.dataValues;
    }
}

module.exports = SyslogCollector;