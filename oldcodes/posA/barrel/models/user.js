import { CarpenterModel, DataTypes } from "../lib/CarpenterModel.js";
import CarpenterModelRelationship from "../lib/CarpenterModelRelationship.js";

export default class User extends CarpenterModel {
    static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.

    static defaultCreateAccess = 'admin';
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';

    static sequelizeDefinition = {
        userID: { type: DataTypes.UUIDV4, primaryKey: true },
        username: { type: DataTypes.STRING, allowNull: false, unique: true },
        email: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: false },
        passwordPlainText: { type: DataTypes.STRING, allowNull: true }, //This will be removed after testing.
        description: { type: DataTypes.STRING(1024), allowNull: true },
        totp_key: { type: DataTypes.STRING, allowNull: true },
        locked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        last_login: { type: DataTypes.DATE, allowNull: true },
        organizationID: { type: DataTypes.UUIDV4, allowNull: false },
    };
    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "users", parentModelName: "Organization", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"organization", requiredForChild: true, childParentKey: 'organizationID', childModelName: "User" }),


    ];
    static seedDataCore = [
        {
            "userID": "a0ec3f73-65f5-41b6-b222-894443bc8a14",
            "username": "admin",
            "email": "admin@example.com",
            "password": "$2b$12$P34sUBpvrm/Sl6zDukW7T.wvZiLdjgVa9YopLYUObTbTOvWN9X.zu",
            "passwordPlainText": "Passw0rd!",
            "description": "MEAD Administrator with full access to everything",
            "locked": false,
            "organizationID": "d11f5a17-3b5b-4a6f-96ec-77616e730cea"
        }
    ]

    static seedDataDemo = [
    ]
}

