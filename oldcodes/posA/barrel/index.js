import { CarpenterServer } from "./lib/CarpenterServer.js";
import models from './models.js'

async function main(params) {
    const dbConfig = { storage: 'database.sqlite', dialect: 'sqlite', logging: console.log };
    const carpenter = new CarpenterServer();
    models(carpenter);
    await carpenter.DatabaseInitialize(dbConfig);
    await carpenter.SeedCoreData(["Organization","User","Location","Network","Subnet"]);
    //await carpenter.SeedDemoData(["Organization","User","Location","Network","Subnet"], true);
    carpenter.Start();
}

main();