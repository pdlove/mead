const { HotspringModel, DataTypes } = require('hotspring-framework');
class InterfaceVLANAssignment extends HotspringModel {
  static modelName = 'interfacevlanassignment';
  static sequelizeDefinition = {
    assignmentID: { type: DataTypes.UUIDV4, primaryKey: true },
    interfaceID: { type: DataTypes.UUIDV4, allowNull: false },
    vlanID: { type: DataTypes.UUIDV4, allowNull: false },
    isTagged: { type: DataTypes.BOOLEAN, allowNull: false },
    lastSeenAt: DataTypes.DATE
  };
}

module.exports = InterfaceVLANAssignment;