import { CarpenterModel, DataTypes } from "../lib/CarpenterModel.js";
import CarpenterModelRelationship from "../lib/CarpenterModelRelationship.js";

export default class Location extends CarpenterModel {
    
    static sequelizeDefinition = {
        locationID: { type: DataTypes.UUIDV4, primaryKey: true },
        organizationID: { type: DataTypes.UUIDV4, allowNull: false },
        name: { type: DataTypes.STRING, allowNull: false },
        ownerUserID: { type: DataTypes.UUIDV4, allowNull: false },
        address: { type: DataTypes.STRING, allowNull: true },
        latitude: { type: DataTypes.FLOAT, allowNull: true },
        longitude: { type: DataTypes.FLOAT, allowNull: true },
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
            parentModelName: "Organization",
            required: true, childParentKey: 'organizationID', childModelName: "Location" }),
        new CarpenterModelRelationship({ connectionType: "1M", 
            parentModelName: "User",
            required: true, childParentKey: 'ownerUserID', childModelName: "Location" }),
    ];

    static seedDataCore = [{
            "locationID": "795c6298-7bf6-47c7-9a16-c99439f9993c",
            "organizationID": "d11f5a17-3b5b-4a6f-96ec-77616e730cea",
            "name": "Default",
            "ownerUserID": "a0ec3f73-65f5-41b6-b222-894443bc8a14"
        }]
    static seedDataDemo = [
        {
            "locationID": "88767b74-cce7-4ba2-b86c-c3fc7d67bcd9",
            "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
            "name": "Site 2",
            "ownerUserID": "b9eb34a3-246d-4674-a9bf-db477e20ce2e",
            "address": "60975 Jessica Squares, Little Rock, AR 73121",
            "latitude": "36.438327",
            "longitude": "-90.747224"
        },
        {
            "locationID": "915b2e80-5138-4962-9aef-045d4ffe9202",
            "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
            "name": "Site 3",
            "ownerUserID": "b9eb34a3-246d-4674-a9bf-db477e20ce2e",
            "address": "93328 Davis Island, Memphis, TN 38971",
            "latitude": "46.794709",
            "longitude": "-95.232849"
        },
        {
            "locationID": "e30f267d-b554-4914-a9b0-03e5689774af",
            "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
            "name": "Site 4",
            "ownerUserID": "b9eb34a3-246d-4674-a9bf-db477e20ce2e",
            "address": "48418 Olsen Plains Apt. 989, St. Louis, MO 63801",
            "latitude": "31.764108",
            "longitude": "-80.91916"
        },
        {
            "locationID": "9f37eac1-e839-450e-9fba-a198a7a4a7eb",
            "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
            "name": "Corporate",
            "ownerUserID": "cf40da73-4c13-4497-89cf-212ffdef0659",
            "address": "12201 Massey Pine Suite 833, Texarkana, TX 75984",
            "latitude": "46.83391",
            "longitude": "-67.981228"
        },
        {
            "locationID": "16b5fd32-7139-496b-ae29-ec3613647559",
            "organizationID": "49d06aa0-8567-439c-a118-4707cacd3737",
            "name": "Corporate",
            "ownerUserID": "b9eb34a3-246d-4674-a9bf-db477e20ce2e",
            "address": "1965 Kelly Field Apt. 094, Texarkana, TX 75839",
            "latitude": "39.840856",
            "longitude": "-109.721139"
        },
        {
            "locationID": "31d55320-d0de-42bf-9cb5-c2a7549a16de",
            "organizationID": "8248c465-3713-4a71-a025-67d5bcd181ad",
            "name": "Sales Pit",
            "ownerUserID": "cf40da73-4c13-4497-89cf-212ffdef0659",
            "address": "8379 Randall Estates Suite 120, Oklahoma City, OK, 73120",
            "latitude": "35.46756",
            "longitude": "-97.516428"
        },
        {
            "locationID": "260a23ee-a787-4001-a4de-79a601bbe451",
            "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
            "name": "San Diego",
            "ownerUserID": "3cab3a43-1dc6-43df-ba61-34664b2a1267",
            "address": "0487 Hull Village Suite 759, San Diego, CA 92418",
            "latitude": "45.266124",
            "longitude": "-80.796599"
        },
        {
            "locationID": "c48b4177-92bc-40dd-85f0-535485f63f63",
            "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
            "name": "Houston",
            "ownerUserID": "3cab3a43-1dc6-43df-ba61-34664b2a1267",
            "address": "242 Christine Glen, Houston, TX 77102",
            "latitude": "35.093718",
            "longitude": "-109.241745"
        },
        {
            "locationID": "3fd7d3a5-c07d-4180-a31e-f860c194348a",
            "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
            "name": "New York",
            "ownerUserID": "3cab3a43-1dc6-43df-ba61-34664b2a1267",
            "address": "1157 Michael Island, New York, NY 10748",
            "latitude": "37.270593",
            "longitude": "-100.918754"
        },
        {
            "locationID": "18035ab3-ea54-47d4-aa20-2eb98bfef3e8",
            "organizationID": "f5bb5b7d-97e2-414a-b265-057b10321e79",
            "name": "Miami",
            "ownerUserID": "3cab3a43-1dc6-43df-ba61-34664b2a1267",
            "address": "778 Brown Plaza, Miami, FL 33176",
            "latitude": "43.811166",
            "longitude": "-106.711175"
        }
    ];
}
