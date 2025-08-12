let snmp = require('../util');
const { HotspringJob } = require("./lib/hotspringJob");

class SNMPDiscovery extends HotspringJob {
    //This section is used by the template
    static jobTemplateID = 0;
    static stackName = '';
    static stack = null;

    static jobTemplateName = 'TemplateJob';
    static description = 'This is simply a template that can be used to create new jobs.';

    static jobTemplateType = 'user-initiated'; // user-initiated, scheduled, system-initiated;
    static defaultInterval = 0;
    static defaultIntervalUnits = 's';
    static defaultRunCount = 1;
    static defaultConfiguration = {};

    static requiredModels = [];
    static defaultAccess = 'admin'; // admin, user, public

    static isEnabled = false;
    static supportsPause = false;
    static supportsCancel = false;
    static supportsUndo = false;

    //This is specific to an instance of a job.
    jobID = 0;
    config = { hosts: [], communities: [] };
    createdOn = new Date();
    status = 'pending';
    progress = null;
    isRunning = false;
    isError = false;
    isPaused = false;

    //There are two types of logging.
    //A job can predefine a hierarchy of steps it will take and then fill in success/failure.
    //In this case, each step can be associated with a specific log entry or set of log entries.

    //A job can simply add log entries that aren't associated with any steps.

    //Although an observer can subscribe to updates for a job, that will be handled by the job manager and NOT the job itself.


    //All of these functions are overridden and used by the job manager
    step_define(stepName, parentstep, displayText, state) { }; //state can be: "Pending","NA","Running", "Warning", "Error", "Critical", "Group". Group is a special state used to indicate this isn't really a step and all steps under it rolls up into this one.
    step_update(stepName, displayText, state, percent) { console.log(displayText," - ", state) }; //state can be: "Pending","NA","Running", "Warning", "Error", "Critical"
    log(message, severity, stepName, associatedType, associatedID) { };

    jobComplete(state, message) { };
    jobFailed(state, message) { };

    //These should be defined in the template.

    //Steps can start off with nothing and add to it as the job executes.
    steps = {
        "verifySNMP": { parent: null, displayText: "Determining SNMP Version", status: "", state: "pending", percent: 0 },
        "fetchSNMP": { parent: null, displayText: "Performing SNMP Walk", status: "", state: "pending", percent: 0 },
        "parse": { parent: null, displayText: "Parse Information", status: "", state: "pending", percent: 0 },
        "parseBasic": { parent: "parse", displayText: "SysInfo and Interfaces", status: "", state: "pending", percent: 0 },
        "parseRemotes": { parent: "parse", displayText: "LLDP and MAC Tables", status: "", state: "pending", percent: 0 },
        "parseARP": { parent: "parse", displayText: "ARP Tables", status: "", state: "pending", percent: 0 },
        "parseVLAN": { parent: "parse", displayText: "VLAN Configuration", status: "", state: "pending", percent: 0 },
        //    "parseVLAN":  {parent: "parse", displayText: "Parse VLAN Configuration", status: "", state: "pending" }
    }


    //validateConfiguration is run on a config prior to creating/starting a job. It's meant to be an initial step to make sure the parameters make sense to run.
    static async validateConfiguration(config) {
        //Verifies that the configuration is possibly correct
        const validation = { valid: false, messages: [] }
        try {
            validation.valid = true;
        }
        catch (err) {
            validation.valid = false;
            validation.messages += "Error when validating: " + err.message;
        }
        return validation
    }

    constructor(config) {
        this.loadConfig(this.config)
    }

    loadConfig(newConfig) {
        if (!newConfig) newConfig = {};
        if (!this.config) this.config = {};
        if (!this.constructor.defaultConfiguration) this.constructor.defaultConfiguration = {};

        this.config = {
            ...this.constructor.defaultConfiguration, // Lowest precedence
            ...this.config,                          // Medium precedence
            ...newConfig                             // Highest precedence
        };
    }

    snmpSessions = {};

    async snmpCheck(hostname, community, version) {
        let snmpSession = new snmp.Session({ target: hostname, community: community, version: snmp.enums.Version[version] });
        try {
            let testValue = await snmpSession.getValue('1.3.6.1.2.1.1.5.0');
            if (!testValue) {
                return null;
            } else {
                return snmpSession;
            }
        } catch (ex) {
            return null;
        }
    }
    async snmpDiscoverCommunityVersion(hostname, communities) {
        //Check version 2 first.
        for (const myCommunity in communities) {
            let mySession = this.snmpCheck(hostname, myCommunity, '2c');
            if (mySession) return mySession;
        }
        //Check version 1 next.
        for (const myCommunity in communities) {
            let mySession = this.snmpCheck(hostname, myCommunity, '1');
            if (mySession) return mySession;
        }
        return null;
    }
    async snmpWalk(hostname, community) {
        //Do something
    }
    async snmpUpdate(hostname, community, newValue) {
        //Do something
    }


    //Interface
    //HighSpeed
    //STP Information
    //PoE Information
    //LLDP Information
    //VLAN Information
    //MAC Address Table

    //Other: ARP Table



    async runJob(config) {
        //Starts the job. This is the main entry point for the job.
        //This is not expected to be awaited but the promise will be monitored to make sure the job didn't end without a completion.


        try {
            for (const myHost in this.config.hosts) {
                step_define('vs_' + myhost, 'verifySNMP', myhost, 'pending');

            }


            const data = { status: "Job Not Implemented" }
            return data;
        }
        catch (err) {
            return err.message;
        }
    }

    async cancelJob(attemptUndo) {
        //Cancel the job. If this job is one that supports undo, then try to undo the job unless the attemptUndo flag is false.
        try {
            // Add code to handle soft deletes
            const data = { status: "Job Not Implemented" }
            return data;
        }
        catch (err) {
            return err.message;
        }
    }

    async pauseJob() {
        //Pause the job.
        try {
            // Add code to handle soft deletes
            const data = { status: "Job Not Implemented" }
            return data;
        }
        catch (err) {
            return err.message;
        }
    }
}

module.exports = { SNMPDiscovery };

