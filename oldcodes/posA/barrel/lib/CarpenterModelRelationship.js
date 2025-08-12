import pluralize from "pluralize";
export default class CarpenterModelRelationship {
    relationshipNameFromParent = ''; // The name of the relationship, e.g. 'userGroup'
    relationshipNameFromChild = ''; // The name of the relationship, e.g. 'userGroup'
    connectionType = ''; // The type of connection, e.g. '1M', 'MM', '1O', 'MO'
    parentModel = null; //Populated during the resolution phase
    parentModelName = ''; // The model that is the parent in the relationship, e.g.
    parentKey = ''; // The key in the parent model that references the child model. If blank, the primary key will be used, e.g. 'id'
    parentConnection
    childModel = null; //Populated during the resolution phase
    childModelName = ''; // The model that is the child in the relationship, e.g. 'system.user'
    childParentKey = ''; // The key in the child model that references the parent model, e.g. 'userID'
    peerModel = null; //Populated during the resolution phase
    peerModelName = ''; // The model that is the peer in the relationship, e.g.
    required = false; // If true, the relationship is required, e.g. 'userGroup' must have a groupID

    constructor(inObject) {
        if (inObject.relationshipNameFromParent) this.relationshipNameFromParent = inObject.relationshipNameFromParent;
        if (inObject.relationshipNameFromChild) this.relationshipNameFromChild = inObject.relationshipNameFromChild;
        if (inObject.connectionType) this.connectionType = inObject.connectionType;
        if (inObject.parentModelName) this.parentModelName = inObject.parentModelName;
        if (inObject.parentKey) this.parentKey = inObject.parentKey;
        if (inObject.childModelName) this.childModelName = inObject.childModelName;
        if (inObject.childParentKey) this.childParentKey = inObject.childParentKey;
        if (inObject.peerModelName) this.peerModelName = inObject.peerModelName;
        if (inObject.required) this.required = inObject.required;
    }
    resolveRelationship(carpenterServer) {
        //We're passing the carpenterServer because the Models really need to link to the carpenterModel and not the Sequelize Model
        this.parentModel = carpenterServer.models[this.parentModelName];
        if (!this.parentModel) throw new Error("Parent Model " + this.parentModelName + " Not found!");
        this.childModel = carpenterServer.models[this.childModelName];
        if (!this.childModel) throw new Error("Child Model " + this.childModelName + " Not found!");
        if (this.peerModelName) {
            this.peerModel = carpenterServer.models[this.peerModelName];
            if (!this.peerModel) throw new Error("Peer Model " + this.peerModelName + " Not found!");
        }

        if (this.connectionType === '11') {
            console.log('Forming One-to-One connection of ' + this.parentModelName + ' <-> ' + this.childModelName);

            //Check that all models were found.
            if (!this.parentModel) throw new Error ("1:1 Relationships missing a Parent Model");
            if (!this.childModel) throw new Error ("1:1 Relationships missing a Child Model");

            //Name the Connection
            if (!this.relationshipNameFromChild)
                this.relationshipNameFromChild = this.parentModel.name;

            if (!this.relationshipNameFromParent)
                this.relationshipNameFromParent = this.childModel.name;

            //Make the connection
            let a = this.childModel.sequelizeObject.belongsTo(this.parentModel.sequelizeObject, { as: this.relationshipNameFromChild, foreignKey: this.childParentKey, allowNull: this.required });
            this.childGet = a.accessors.get;
            let b = this.parentModel.sequelizeObject.hasOne(this.childModel.sequelizeObject, { as: this.relationshipNameFromParent, foreignKey: this.childParentKey });
            this.parentGet = b.accessors.get;
        } else if (this.connectionType === '1M') {
            console.log('Forming One-to-Many connection of ' + this.parentModelName + ' <-> ' + this.childModelName);

            //Check that all models were found.
            if (!this.parentModel) throw new Error ("1:Many Relationships missing a Parent Model");
            if (!this.childModel) throw new Error ("1:Many Relationships missing a Child Model");

            //Need to setup the relationship names
            if (!this.relationshipNameFromChild)
                this.relationshipNameFromChild = this.parentModel.name;

            if (!this.relationshipNameFromParent)
                this.relationshipNameFromParent = pluralize(this.childModel.name);

            //Make the connection
            let a = this.childModel.sequelizeObject.belongsTo(this.parentModel.sequelizeObject, { as: this.relationshipNameFromChild, foreignKey: this.childParentKey, allowNull: this.required });
            this.childGet = a.accessors.get;
            let b = this.parentModel.sequelizeObject.hasMany(this.childModel.sequelizeObject, { as: this.relationshipNameFromParent, foreignKey: this.childParentKey });
            this.parentGet = b.accessors.get;

        } else if (this.connectionType === 'MM') {
            //Check that all models were found.
            console.log('Forming Many-to-Many connection of ' + this.parentModelName + ' <-> ' + this.childModelName + ' <-> ' + this.peerModelName);

            //Check that all models were found.
            if (!this.parentModel) throw new Error ("Many:Many Relationships missing a Parent Model");
            if (!this.childModel) throw new Error ("Many:Many Relationships missing a Child Model");
            if (!this.peerModel) throw new Error ("Many:Many Relationships missing a Peer Model");

                        //Need to setup the relationship names
            if (!this.relationshipNameFromChild)
                this.relationshipNameFromChild = pluralize(this.parentModel.name);

            if (!this.relationshipNameFromParent)
                this.relationshipNameFromParent = pluralize(this.childModel.name);

            //Make the connection
            let b = this.parentModel.sequelizeObject.belongsToMany(this.peerModel.sequelizeObject, { as: this.relationshipNameFromChild, through: this.childModel.sequelizeObject, foreignKey: this.childParentKey, otherKey: this.childPeerKey });
            this.parentGet = b.accessors.get;
            let a =this.peerModel.sequelizeObject.belongsToMany(this.parentModel.sequelizeObject, { as: this.relationshipNameFromParent, through: this.childModel.sequelizeObject, foreignKey: this.childPeerKey, otherKey: this.childParentKey });
            this.childGet = a.accessors.get;
            //TODO: The Many to Many needs work. peer and child have slightly different meanings here.
        }
        
        //Add relationship to a relationship lookup on each model so that we can know how to find it.
        if (!this.parentModel.sequelizeRelationships) this.parentModel.sequelizeRelationships = {};
        this.parentModel.sequelizeRelationships[this.relationshipNameFromParent.toLowerCase()] = this;
        if (!this.childModel.sequelizeRelationships) this.childModel.sequelizeRelationships = {};
        this.childModel.sequelizeRelationships[this.relationshipNameFromChild.toLowerCase()] = this;
    }
}