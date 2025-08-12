const { HotspringModel, DataTypes } = require('hotspring-framework').HotspringModel;

class Recipe extends HotspringModel {
  static name = 'recipe';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'user'; //admin, user, public

  static sequelizeDefinition = {
    id: { type: DataTypes.STRING, primaryKey: true },
    slug: DataTypes.STRING,
    groupId: { type: DataTypes.STRING },
    userId: { type: DataTypes.STRING, },
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.STRING,
    image: DataTypes.STRING,
    totalTime: DataTypes.STRING,
    prepTime: DataTypes.STRING,
    performTime: DataTypes.STRING,
    cookTime: DataTypes.STRING,
    recipeYield: DataTypes.STRING,
    recipeCuisine: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    orgUrl: DataTypes.STRING,
    dateAdded: DataTypes.DATE,
    dateUpdated: DataTypes.DATE,
    isOcrRecipe: DataTypes.BOOLEAN,
    lastMade: DataTypes.DATE,
    nameNormalized: { type: DataTypes.STRING, allowNull: false },
    descriptionNormalized: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  };
  static sequelizeConnections = [
     { connection: "1M", parentType: "cookbook.group", parentKey: "groupID", childType: "cookbook.recipe", childKey: "groupID" },
     { connection: "1M", parentType: "cookbook.user", parentKey: "userID", childType: "cookbook.recipe", childKey: "userID" }
  ]
}

module.exports = Recipe;