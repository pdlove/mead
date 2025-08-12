import 'dotenv/config'

import { CarpenterServer } from "./carpenter/CarpenterServer.js";
import * as models from './models/index.js'
import { Login } from "./routes/Login.js"
import { Components } from "./routes/Components.js"

async function main(params) {
    const dbConfig = { storage: 'database.sqlite', dialect: 'sqlite', logging: console.log, define: { underscored: true, } };
    const carpenter = new CarpenterServer();
    models.loadModels(carpenter);
    carpenter.AddRouteObject(Login);
    carpenter.AddRouteObject(Components);
    //Check if database exists

    await carpenter.DatabaseInitialize(dbConfig);
    const seededModels = await carpenter.SeedCoreData(models.seedOrder);
    await carpenter.SeedDemoData(seededModels,true);
    //await carpenter.SeedDemoData(["Organization","User","Location","Network","Subnet"], true);

    carpenter.Start();

}

main();

