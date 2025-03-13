async function SeedDatabase(queryInterface) {
    await queryInterface.bulkInsert('Menus', [
      { "menuID": 1, "parent_menu_id": null, "iconClass": "nc-icon nc-bank", "name": "Dashboard", "clientPackage":"dashboard", createdAt: new Date(), updatedAt: new Date()  },

      { "menuID": 2, "parent_menu_id": null, "iconClass": "nc-icon nc-book-bookmark", "name": "Transactions", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 3, "parent_menu_id": 2, "iconText": "PoS", "name": "Point of Sale", "clientPackage": "pos", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 4, "parent_menu_id": 2, "iconText": "O", "name": "Order Request", "clientPackage": "custom_order", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 5, "parent_menu_id": 2, "iconText": "R", "name": "Recent Sales", "clientPackage":"transaction_history", "clientPackageParameters": '{"query":"recent"}', createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 6, "parent_menu_id": 2, "iconText": "F", "name": "Full History", "clientPackage":"transaction_history", "clientPackageParameters": '{"query":"full"}', createdAt: new Date(), updatedAt: new Date()  },

      { "menuID": 10, "parent_menu_id": null, "iconClass": "nc-icon nc-book-bookmark", "name": "Inventory", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 11, "parent_menu_id": 10, "iconText": "R", "name": "Receive Shipment", "clientPackage": "receive", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 12, "parent_menu_id": 10, "iconText": "B", "name": "Blanks", "clientPackage": "receive", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 13, "parent_menu_id": 10, "iconText": "O", "name": "Order Product", "clientPackage": "receive", createdAt: new Date(), updatedAt: new Date()  },

      { "menuID": 20, "parent_menu_id": null, "iconClass": "nc-icon nc-book-bookmark", "name": "Artwork", createdAt: new Date(), updatedAt: new Date()  },

      { "menuID": 30, "parent_menu_id": null, "iconClass": "nc-icon nc-book-bookmark", "name": "Configuration", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 31, "parent_menu_id": 30, "iconText": "P", "name": "Products", "clientPackage": "config_product", createdAt: new Date(), updatedAt: new Date()  },
      { "menuID": 32, "parent_menu_id": 30, "iconText": "V", "name": "Vendors", "clientPackage": "config_vendor", createdAt: new Date(), updatedAt: new Date()  },
      
    ], {});

    await queryInterface.bulkInsert('Users', [ 
      {userID: 1,username: "admin",  password: "$2b$10$4WnFV5PrgXLqqjRkrweZJO.39LiqwdQTB1eemK56.QiAFazZ5AStu",  locked: false, createdAt: new Date(), updatedAt: new Date()  },
    ]);

    await queryInterface.bulkInsert("Categories", [
      { "categoryID": 1, "parent_categoryID": null, "tabletype": "products", "name": "Apparel", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 2, "parent_categoryID": 1, "tabletype": "products", "name": "Bags", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 3, "parent_categoryID": 1, "tabletype": "products", "name": "Shirts", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 4, "parent_categoryID": 3, "tabletype": "products", "name": "Plain Tee", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 5, "parent_categoryID": null, "tabletype": "products", "name": "Drinkware", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 6, "parent_categoryID": 5, "tabletype": "products", "name": "Tumblers", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 7, "parent_categoryID": 6, "tabletype": "products", "name": "Plain", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 8, "parent_categoryID": 6, "tabletype": "products", "name": "Glitter", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 9, "parent_categoryID": 6, "tabletype": "products", "name": "Glow In The Dark", createdAt: new Date(), updatedAt: new Date() },
      { "categoryID": 10, "parent_categoryID": 5, "tabletype": "products", "name": "Shot Glasses", createdAt: new Date(), updatedAt: new Date() }      
    ]);
  }
//'$2b$10$DUG9tWmdx/zVzw3gqGE0TOyrXlmT9aAMhz2EX84syUloNnfJ9fI5a'
//Dashboard


//	Artwork
	
//Configuration
//	Products
//	Vendors
//	Customers
//	Users

console.log("Initializing the Database");
const db = require('./models');

// Sync database and start server
db.sequelize.sync().then(() => {
    console.log("Seeding the Database");
    SeedDatabase(db.sequelize.queryInterface).then(() => {console.log("Done")}).catch(err => {console.error('Unable to Seed Database: ', err)});
}).catch(err => {
    console.error('Error syncing database:', err);
  });
  

