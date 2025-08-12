const { HotspringModel, DataTypes } = require('hotspring-framework').HotspringModel;

class User extends HotspringModel {
  static name = 'user';
  static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.
  static defaultWriteAccess = 'admin'; //admin, user, public
  static defaultReadAccess = 'user'; //admin, user, public

  static sequelizeDefinition = {
    id: { type: DataTypes.STRING(32), primaryKey: true },
    fullName: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    admin: DataTypes.BOOLEAN,
    advanced: DataTypes.BOOLEAN,
    groupId: DataTypes.STRING,      
    cacheKey: DataTypes.STRING,
    canManage: DataTypes.BOOLEAN,
    canInvite: DataTypes.BOOLEAN,
    canOrganize: DataTypes.BOOLEAN,
    loginAttempts: DataTypes.INTEGER,
    lockedAt: DataTypes.DATE,
    authMethod: { type: DataTypes.STRING(6), defaultValue: 'MEALIE', allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  };
  static sequelizeConnections = [
     { connection: "1M", parentType: "cookbook.user", parentKey: "groupID", childType: "cookbook.group", childKey: "groupID" }
  ]
}

module.exports = User;