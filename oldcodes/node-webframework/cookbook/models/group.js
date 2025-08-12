const { HotspringModel, DataTypes } = require('hotspring-framework').HotspringModel;

class Group extends HotspringModel {
  static name = 'group';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'user'; //admin, user, public

  static sequelizeDefinition = {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING },
    createdAt: { type: DataTypes.DATE },
    updatedAt: { type: DataTypes.DATE }
};
static sequelizeConnections = []
}

module.exports = Group;