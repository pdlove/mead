const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite:radius.db');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Groups = require('../stacks/system/models/security/group')(sequelize, Sequelize.DataTypes);
db.Menus = require('../stacks/system/models/security/menu')(sequelize, Sequelize.DataTypes);
db.Users = require('../stacks/system/models/security/user')(sequelize, Sequelize.DataTypes);
db.Categories = require('./system/category')(sequelize, Sequelize.DataTypes);

db.Groups.belongsTo(db.Users, { as: 'AddedByUser', foreignKey: 'added_by_user_id' });
db.Groups.belongsToMany(db.Users, { through: 'UserGroups' });
db.Users.belongsToMany(db.Groups, { through: 'UserGroups' });
db.Menus.hasMany(db.Menus, { as: "Submenus", foreignKey: "parent_menu_id" });
db.Menus.belongsTo(db.Menus, { as: "ParentMenu", foreignKey: "parent_menu_id" });



db.Products = require('../../../../Not_Installed_Stacks/pos/models/product')(sequelize, Sequelize.DataTypes);

db.Categories.hasMany(db.Categories, { as: "Subcategories", foreignKey: "parent_categoryID" });
db.Categories.belongsTo(db.Categories, { as: "ParentCategory", foreignKey: "parent_categoryID" });

db.Categories.hasMany(db.Products, { foreignKey: 'categoryID' });
db.Products.belongsTo(db.Categories, { foreignKey: 'categoryID' });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;