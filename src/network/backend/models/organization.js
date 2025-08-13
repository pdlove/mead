import { CarpenterModel, DataTypes } from "../lib/CarpenterModel.js";
import CarpenterModelRelationship from "../lib/CarpenterModelRelationship.js";

export default class Organization extends CarpenterModel {

    static autoRoute = true; // Creates CRUD Routes and CRUD Views automatically.

    static defaultCreateAccess = 'admin';
    static defaultWriteAccess = 'admin';
    static defaultReadAccess = 'admin';

    static sequelizeDefinition = {
        organizationID: { type: DataTypes.UUIDV4, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true },
        streetAddress: { type: DataTypes.STRING, allowNull: true },
        phonenumber: { type: DataTypes.STRING, allowNull: true },
        ownerUserID: { type: DataTypes.UUIDV4, allowNull: true },
        technicalContact: { type: DataTypes.STRING, allowNull: true },
        technicalContactEmail: { type: DataTypes.STRING, allowNull: true },
        technicalContactPhone: { type: DataTypes.STRING, allowNull: true },
        technicalContactNotes: { type: DataTypes.TEXT, allowNull: true },
        billingContact: { type: DataTypes.STRING, allowNull: true },
        billingContactEmail: { type: DataTypes.STRING, allowNull: true },
        billingContactPhone: { type: DataTypes.STRING, allowNull: true },
        billingContactNotes: { type: DataTypes.TEXT, allowNull: true },
        schedulingContact: { type: DataTypes.STRING, allowNull: true },
        schedulingContactEmail: { type: DataTypes.STRING, allowNull: true },
        schedulingContactPhone: { type: DataTypes.STRING, allowNull: true },
        schedulingContactNotes: { type: DataTypes.TEXT, allowNull: true },
    };
    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M", 
            relationshipNameFromParent: "ownedOrganizations", parentModelName: "User", //parentKey defaults to the primary key. requiredForParent is only valid if anything but the primary key is used.
            relationshipNameFromChild:"owningUser", required: false, childParentKey: 'ownerUserID', childModelName: "Organization" }) //This isn't require simply for data population.
    ];
    static seedDataCore = [{
        "organizationID": "d11f5a17-3b5b-4a6f-96ec-77616e730cea",
        "name": " Default",
        "description": "The MEAD parent Company",
    }];
    static seedDataDemo = [
        {
            "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
            "name": "Nexora Solutions",
            "description": "Cloud-native enterprise software provider",
            "streetAddress": "1438 Willow Bend Dr, Springfield, IL 62704",
            "phonenumber": "(217) 555-7291",
            "ownerUserID": "a0ec3f73-65f5-41b6-b222-894443bc8a14",
            "technicalContact": "Jamie Chen",
            "technicalContactEmail": "jchen@nexora.com",
            "technicalContactPhone": "(217) 555-9203",
            "technicalContactNotes": "Handles cloud integration and backend infrastructure.",
            "billingContact": "Mark Redford",
            "billingContactEmail": "mredford@nexora.com",
            "billingContactPhone": "(217) 555-5582",
            "billingContactNotes": "Contact for invoicing and payment issues.",
            "schedulingContact": "Alicia Dominguez",
            "schedulingContactEmail": "adominguez@nexora.com",
            "schedulingContactPhone": "(217) 555-3321",
            "schedulingContactNotes": "Coordinates system update and deployment timelines."
        },
        {
            "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
            "name": "Bluegrid Technologies",
            "description": "IoT and smart sensor hardware manufacturing",
            "streetAddress": "6281 Bayview Terrace, Tampa, FL 33615",
            "phonenumber": "(813) 555-1843",
            "ownerUserID": "a0ec3f73-65f5-41b6-b222-894443bc8a14",
            "technicalContact": "Leo Watkins",
            "technicalContactEmail": "lwatkins@bluegridtech.com",
            "technicalContactPhone": "(813) 555-0148",
            "technicalContactNotes": "Manages device firmware and diagnostics.",
            "billingContact": "Sandra Lin",
            "billingContactEmail": "sandra.lin@bluegridtech.com",
            "billingContactPhone": "(813) 555-6002",
            "billingContactNotes": "Handles billing cycles and contract renewals.",
            "schedulingContact": "Brian Ellis",
            "schedulingContactEmail": "bellis@bluegridtech.com",
            "schedulingContactPhone": "(813) 555-8787",
            "schedulingContactNotes": "Oversees installation and maintenance appointments."
        },
        {
            "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
            "name": "Vantico Systems",
            "description": "Network infrastructure consulting for mid-sized enterprises",
            "streetAddress": "309 West Elm Street, Fort Worth, TX 76104",
            "phonenumber": "(817) 555-6027",
            "ownerUserID": "a0ec3f73-65f5-41b6-b222-894443bc8a14",
            "technicalContact": "Priya Mehta",
            "technicalContactEmail": "pmehta@vantico.io",
            "technicalContactPhone": "(817) 555-2210",
            "technicalContactNotes": "Specializes in VLAN design and security compliance.",
            "billingContact": "Jerome Fields",
            "billingContactEmail": "jfields@vantico.io",
            "billingContactPhone": "(817) 555-0094",
            "billingContactNotes": "Manages purchase orders and financial records.",
            "schedulingContact": "Carla Nguyen",
            "schedulingContactEmail": "cnguyen@vantico.io",
            "schedulingContactPhone": "(817) 555-1942",
            "schedulingContactNotes": "Books on-site audits and review sessions."
        }
    ]
}
