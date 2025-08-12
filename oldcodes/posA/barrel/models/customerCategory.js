import { CarpenterModel, DataTypes } from "../lib/CarpenterModel.js";
import CarpenterModelRelationship from "../lib/CarpenterModelRelationship.js";

export default class CustomerCategory extends CarpenterModel {
    static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.

    static defaultCreateAccess = 'admin';
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';

    static sequelizeDefinition = {
        categoryID: { type: DataTypes.UUIDV4, primaryKey: true },
        categoryName: { type: DataTypes.STRING, allowNull: false },
        shortName: { type: DataTypes.STRING, allowNull: false },
        parentCategoryID: { type: DataTypes.UUIDV4, allowNull: true },
        organizationID: { type: DataTypes.UUIDV4, allowNull: false },
    };
    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "customerCategories", parentModelName: "Organization", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"organization", requiredForChild: true, childParentKey: 'organizationID', childModelName: "CustomerCategory" }),
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "parent", parentModelName: "ProductCategory", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"children", requiredForChild: true, childParentKey: 'parentCategoryID', childModelName: "CustomerCategory" }),
    ];
    //TODO: Seed Data for a CustomerCategory
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

