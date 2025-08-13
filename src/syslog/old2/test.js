const { Pool } = require('pg');
const { syslogServer } = require('./syslog-server');

const pgsql = new Pool({
    user: 'meadserver',
    host: '10.17.1.21',
    database: 'mead',
    password: 'YoMomma',
    port: 5432, // Default PostgreSQL port
  });


let myServer = new syslogServer(pgsql);
//myServer.startService();

const { syslogProcessor } = require('./syslog-processor');
let processor = new syslogProcessor(pgsql);
processor.processBatch();


