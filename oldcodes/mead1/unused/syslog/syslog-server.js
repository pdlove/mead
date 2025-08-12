//const {networkTraffic_flows} = require('./models/networkTraffic_flows');
const { Syslogd } = require('./syslog');  // Adjust path if necessary
const pgformat = require('pg-format');

class syslogServer {
    constructor(pgsql) {
        this.pgsql = pgsql;
        // Create a new Syslogd server instance
        this.server = new Syslogd();
        // Add event listeners
        this.server.on('listening', () => {
            console.log('Syslog server is listening on port 514');
        });
        this.server.on('message', (info) => {
            if (!this.trafficLogsBuffer[info.sourceIP])
                this.trafficLogsBuffer[info.sourceIP] = [];
            // Check for null characters in info.msg and remove them
            info.msg = info.msg.replace(/\0/g, '');
            
            this.trafficLogsBuffer[info.sourceIP].push(info);
        });
        this.server.on('error', (err) => {
            console.error('Error occurred:', err);
        });
    }
    // Function to get the next batch ID
    async pushSyslogBatch(hostIP, day, syslogBatch) {
        const client = await this.pgsql.connect();
        try {
            // Start a transaction
            await client.query('BEGIN');

            // Get the next batch ID
            const query = `SELECT COALESCE(MAX(batchID), 0) + 1 AS nextBatchID FROM syslog.batch WHERE hostip = $1 AND day = $2;`;
            const result = await client.query(query, [hostIP, day]);
            // Extract the next batch ID from the result
            const batchid = result.rows[0].nextbatchid;

            // Insert the new line into syslogBatch with state of 0 for initialized (Not yet uploaded)
            const insertBatchQuery = `INSERT INTO syslog.batch (batchID, hostIP, day, state) VALUES ($1, $2, $3, 0);`;
            await client.query(insertBatchQuery, [batchid, hostIP, day]);

            let lineID = 1;
            // Prepare data for bulk insert
            const staticState = 1; // Default state value is 1 for Unprocessed
            const values = syslogBatch.map(log => [
                hostIP,
                day,
                batchid,
                lineID++, // Replace with actual property names
                log.facility, // Replace with actual property names
                log.severity, // Replace with actual property names
                log.time, // Replace with actual property names
                log.msg, // Replace with actual property names
                staticState
            ]);

            // Create parameterized query for bulk insert using pg-format
            const insertQuery = pgformat(`
                INSERT INTO syslog.messages_unprocessed (hostIP, day, batchID, lineID, facility, severity, time, message, state)
                VALUES %L
            `, values);

            // Execute bulk insert
            await client.query(insertQuery);

            // Flag batch as unprocessed and set number of lines uploaded
            const batchUpdateQuery = `UPDATE syslog.batch SET state = 1, totallines = $4 WHERE hostip = $1 AND day = $2 AND batchid = $3;`;
            await client.query(batchUpdateQuery, [hostIP, day, batchid, lineID]);

            await client.query('COMMIT');

        } catch (error) {
            // Rollback the transaction in case of error
            await client.query('ROLLBACK');
            console.error('Error getting next batch ID:', error);
            throw error;
        } finally {
            client.release();
        }
    }
    
    useAPI=false;
    trafficLogsBuffer = {}; // Buffer to accumulate traffic logs by host
    bufferCyleInterval = 1; // Interval in minutes to cycle the buffer
    bufferCycleTimer = null; // Timer to cycle the buffer

    async cycleBuffer() {
        let prevBuffer = this.trafficLogsBuffer;
        this.trafficLogsBuffer = {}; // Clear the buffer
            
        const today = new Date();
        const daynum = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        if (this.useAPI) {
            //Upload buffer using APIjV*9XxUHeUNkm2sQ*JAfGK.YB
        } else {
            //Cycle through each host in prevBuffer.
            for (const hostIP of Object.keys(prevBuffer)) {
                //Create new batch in the database
                await this.pushSyslogBatch(hostIP, daynum, prevBuffer[hostIP]);
            }             
        }
    }   


    async startService() {
        // Start the server on port 514
        this.server.startListening(514, (err) => {
            if (err) {
                console.error('Failed to start server:', err);
            }
        });
        this.bufferCycleTimer = setInterval(this.cycleBuffer.bind(this), this.bufferCyleInterval * 60 * 1000);
    }

    async stopService() {
        this.server.stopListening();
        clearInterval(this.bufferCycleTimer);
        this.cycleBuffer();
    }
}
module.exports = { syslogServer };