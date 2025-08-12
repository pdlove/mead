const { HotspringModel, DataTypes } = require('hotspring-framework');

class CategoryLink extends HotspringModel {
    static modelName = 'categorylink';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      categoryLinkID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      categoryID: { type: DataTypes.INTEGER, required: true },
      linkedTableName: { type: DataTypes.STRING, required: true },
      linkedID: { type: DataTypes.INTEGER, required: true }
    };
  }

module.exports = CategoryLink;