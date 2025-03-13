

class syslogProcessor {
    constructor(pgsql) {
        this.pgsql = pgsql;
    }


    
    async processBatch() {
        const client = await this.pgsql.connect();

        try {
            // Start a transaction
            await client.query('BEGIN');

            // Get the first syslog.batch record where state=1
            const batchResult = await client.query(`SELECT * FROM syslog.batch WHERE state = 1 ORDER BY uploadtime LIMIT 1`);

            if (batchResult.rows.length === 0) {
                console.log('No batches to process.');
                await client.query('COMMIT');
                return;
            }

            const batch = batchResult.rows[0];
            const { hostip, day, batchid } = batch;

            // Get related records from messages_unprocessed
            const messagesResult = await client.query(`SELECT * FROM syslog.messages_unprocessed WHERE hostip = $1 AND day = $2 AND batchid = $3 AND state=1`, [hostip, day, batchid]);

            for (const message of messagesResult.rows) {
                try {
                    // Process the message
                    // Replace the following line with your actual processing logic
                    const processed = this.processMessage(message);

                    // Update the state based on the processing result
                    const newState = processed ? 2 : 3;
                    await client.query(`UPDATE syslog.messages_unprocessed SET state = $1 WHERE hostip = $2 AND day = $3 AND batchid = $4 AND lineid = $5`, [newState, hostip, day, batchid, message.lineid]);
                } catch (error) {
                    console.error('Error processing message:', error);
                    // Update the state to 4 if an error is encountered
                    await client.query(`UPDATE syslog.messages_unprocessed SET state = 4 WHERE hostip = $1 AND day = $2 AND batchid = $3 AND lineid = $4`, [hostip, day, batchid, message.lineid]);
                }
            }

            // Update the batch state to indicate processing is complete
            await client.query(`UPDATE syslog.batch SET state = 2 WHERE hostip = $1 AND day = $2 AND batchid = $3 `, [hostip, day, batchid]);

            await client.query('COMMIT');
        } catch (error) {
            // Rollback the transaction in case of error
            await client.query('ROLLBACK');
            console.error('Error processing batch:', error);
        } finally {
            client.release();
        }
    }

    processMessage(message) {
        // Implement your message processing logic here
        // Return true if processed successfully, false if not able to process
        return true; // Placeholder
    }
}

module.exports = { syslogProcessor };