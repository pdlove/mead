const { hotspringData_Base } = require('')
// snmpWalk class that extends dbObjectBase
class snmpWalk extends hotspringData_Base {
  snmpWalkId;
  host;
  community;
  rootOID;
  walkTime = new Date();
  deviceId;
  
  constructor(myClient) {
    super(myClient);
  }

  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS snmpWalk (
        snmpWalkId SERIAL PRIMARY KEY,
        host VARCHAR(255) NOT NULL,
        community VARCHAR(255) NOT NULL,
        rootOID VARCHAR(2048) NOT NULL,
        walkTime TIMESTAMP NOT NULL DEFAULT NOW(),
        deviceId INT NOT NULL
      );
    `;
    return this.executeQuery(query);
  }

  async getData(filter) {
    

    const query = `
      SELECT * FROM snmpWalk
      WHERE snmpWalkId = $1;
    `;
    const result = await this.executeQuery(query, [snmpWalkId]);
    return result.rows;
  }

  async insertData({ host, community, rootOID, deviceId }) {
    const query = `
      INSERT INTO snmpWalk (host, community, rootOID, deviceId)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await this.executeQuery(query, [host, community, rootOID, deviceId]);
    return result.rows[0];
  }

  async updateData(snmpWalkId, { host, community, rootOID, deviceId }) {
    const query = `
      UPDATE snmpWalk
      SET host = $2, community = $3, rootOID = $4, deviceId = $5
      WHERE snmpWalkId = $1
      RETURNING *;
    `;
    const result = await this.executeQuery(query, [snmpWalkId, host, community, rootOID, deviceId]);
    return result.rows[0];
  }

  async deleteData(snmpWalkId) {
    const query = `
      DELETE FROM snmpWalk
      WHERE snmpWalkId = $1;
    `;
    await this.executeQuery(query, [snmpWalkId]);
    return { message: `SNMP Walk with ID ${snmpWalkId} deleted.` };
  }
}

// Example usage:
const { Client } = require('pg');
const myClient = new Client({
  user: 'your_pg_username',
  host: 'localhost',
  database: 'your_database',
  password: 'your_pg_password',
  port: 5432,
});

// Initialize and use the snmpWalk class
(async () => {
  await myClient.connect();
  const snmpWalkTable = new snmpWalk(myClient);

  // Create the table
  await snmpWalkTable.createTable();

  // Insert data
  const insertedData = await snmpWalkTable.insertData({
    host: '192.168.1.1',
    community: 'public',
    rootOID: '1.3.6.1.2.1',
    deviceId: 1,
  });
  console.log('Inserted Data:', insertedData);

  // Fetch data
  const data = await snmpWalkTable.getData(insertedData.snmpWalkId);
  console.log('Fetched Data:', data);

  // Update data
  const updatedData = await snmpWalkTable.updateData(insertedData.snmpWalkId, {
    host: '192.168.1.2',
    community: 'private',
    rootOID: '1.3.6.1.2.2',
    deviceId: 2,
  });
  console.log('Updated Data:', updatedData);

  // Delete data
  const deleteMessage = await snmpWalkTable.deleteData(insertedData.snmpWalkId);
  console.log(deleteMessage);

  await myClient.end();
})();