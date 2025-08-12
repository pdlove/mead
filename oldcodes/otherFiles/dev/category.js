const { hotspringData_Base, sequelizeTypes } = require('hotspring');
class category extends hotspringData_Base {
    name = "category"
    sequelizeDefinition = {
        categoryID: { type: sequelizeTypes.INTEGER, primaryKey: true, autoIncrement: true }, 
        parent_categoryID: { type: sequelizeTypes.INTEGER, allowNull: true }, 
        tabletype: { type: sequelizeTypes.STRING, allowNull: false, defaultValue: "Products" },
        name: { type: sequelizeTypes.STRING, allowNull: false }
    };
    assignSequelizeRelationships(dbModels) {
        dbModels.system.categories.hasMany(dbModels.system.categories, { as: "Subcategories", foreignKey: "parent_categoryID" });
        dbModels.system.categories.belongsTo(dbModels.system.categories, { as: "ParentCategory", foreignKey: "parent_categoryID" });
    }
}

module.exports = { category }

