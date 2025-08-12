class hotspringData_Base {
    #dbClient;
    #dbType = 'pgsql';
  
    constructor(myClient) {
      this.#dbClient = myClient;
    }
  
    async executeQuery(query, params = []) {
      try {
        return await this.#dbClient.query(query, params);
      } catch (err) {
        console.error('Database query error:', err);
        throw err;
      }
    }
  
    async createTable() {
      throw new Error('createTable() method must be implemented.');
    }
  
    async getData() {
      throw new Error('getData() method must be implemented.');
    }
  
    async insertData() {
      throw new Error('insertData() method must be implemented.');
    }
  
    async updateData() {
      throw new Error('updateData() method must be implemented.');
    }
  
    async deleteData() {
      throw new Error('deleteData() method must be implemented.');
    }
  }