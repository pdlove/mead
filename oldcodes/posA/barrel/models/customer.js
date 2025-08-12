import { CarpenterModel, DataTypes } from "../lib/CarpenterModel.js";
import CarpenterModelRelationship from "../lib/CarpenterModelRelationship.js";

export default class Customer extends CarpenterModel {
    static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.

    static defaultCreateAccess = 'admin';
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';

    static sequelizeDefinition = {
        customerID: { type: DataTypes.UUIDV4, primaryKey: true },
        customerCategory: { type: DataTypes.UUIDV4, allowNull: false },
        customerName: { type: DataTypes.STRING, allowNull: false },
        last_sale: { type: DataTypes.DATE, allowNull: true },
        addedBy: { type: DataTypes.UUIDV4, allowNull: false},
        address: { type: DataTypes.STRING, allowNull: true},
        billingContact: { type: DataTypes.STRING, allowNull: true },
        billingContactEmail: { type: DataTypes.STRING, allowNull: true },
        billingContactPhone: { type: DataTypes.STRING, allowNull: true },
        billingContactNotes: { type: DataTypes.TEXT, allowNull: true },
        primaryContact: { type: DataTypes.STRING, allowNull: true },
        primaryContactEmail: { type: DataTypes.STRING, allowNull: true },
        primaryContactPhone: { type: DataTypes.STRING, allowNull: true },
        primaryContactNotes: { type: DataTypes.TEXT, allowNull: true },
        organizationID: { type: DataTypes.UUIDV4, allowNull: false },
    };
    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "customers", parentModelName: "Organization", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"organization", requiredForChild: true, childParentKey: 'organizationID', childModelName: "Customer" }),
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "employee", parentModelName: "User", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"customers", requiredForChild: true, childParentKey: 'addedBy', childModelName: "Customer" }),
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "parent", parentModelName: "ProductCategory", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"children", requiredForChild: true, childParentKey: 'parentCategoryID', childModelName: "CustomerCategory" }),
    ];
    //TODO: Seed Data for a Customer
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

