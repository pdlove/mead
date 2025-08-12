const { HotspringModel, DataTypes } = require('hotspring-framework');

class Category extends HotspringModel {
    static modelName = 'category';
    static autoRoute = true;
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';
  
    static sequelizeDefinition = {
      categoryID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, required: true },
      description: { type: DataTypes.TEXT, required: false },
      imageUrl: { type: DataTypes.STRING, required: false },
      parentCategoryID: { type: DataTypes.INTEGER, required: false, defaultValue: null }
    };
  }

module.exports = Category;
