import { CarpenterModel, DataTypes } from "../../../carpenter/CarpenterModel.js";
import CarpenterModelRelationship from "../../../carpenter/CarpenterModelRelationship.js";

// --- ServiceGroup Model ---
export class ServiceGroup extends CarpenterModel {
    static sequelizeDefinition = {
        serviceGroupId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "ServiceGroup",
            required: true, childParentKey: 'serviceGroupId', childModelName: "Service" }),
    ];

    static seedDataDemo = [
        { serviceGroupId: "4a5b6c7d-8e9f-4012-3456-7890abcdef12", name: "Web Servers", description: "Services for hosting web applications." },
        { serviceGroupId: "5b6c7d8e-9f0a-4123-4567-890abcdef123", name: "Load Balancers", description: "Services for distributing network traffic." },
        { serviceGroupId: "6c7d8e9f-0a1b-4234-5678-90abcdef1234", name: "Databases", description: "Services for data storage and retrieval." },
        { serviceGroupId: "7d8e9f0a-1b2c-4345-6789-0abcdef12345", name: "Caching", description: "Services for improving data access speed." },
        { serviceGroupId: "8e9f0a1b-2c3d-4456-7890-abcdef123456", name: "Application Runtimes", description: "Environments for executing application code." },
    ];
};

// --- Service Model ---
export class Service extends CarpenterModel {
    static sequelizeDefinition = {
        serviceId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING, allowNull: true, },
        serviceGroupId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServiceGroup",
            required: true, parentParentKey: 'serviceGroupId', childModelName: "Service", childParentKey: 'serviceGroupId' }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Service",
            required: true, childParentKey: 'serviceId', childModelName: "ServiceVersion" }),
    ];

    static seedDataDemo = [
        { serviceId: "9f0a1b2c-3d4e-4567-8901-234567890abc", name: "NGINX", description: "High-performance web server and reverse proxy.", serviceGroupId: "5b6c7d8e-9f0a-4123-4567-890abcdef123" },
        { serviceId: "0a1b2c3d-4e5f-4678-9012-34567890abcd", name: "HAProxy", description: "Reliable, high performance TCP/HTTP load balancer.", serviceGroupId: "5b6c7d8e-9f0a-4123-4567-890abcdef123" },
        { serviceId: "1b2c3d4e-5f6a-4789-0123-4567890abcde", name: "MySQL", description: "Popular open-source relational database.", serviceGroupId: "6c7d8e9f-0a1b-4234-5678-90abcdef1234" },
        { serviceId: "2c3d4e5f-6a7b-4890-1234-567890abcdef", name: "Redis", description: "In-memory data structure store, used as a database, cache and message broker.", serviceGroupId: "7d8e9f0a-1b2c-4345-6789-0abcdef12345" },
        { serviceId: "3d4e5f6a-7b8c-4901-2345-67890abcdef0", name: "Node.js", description: "JavaScript runtime built on Chrome's V8 JavaScript engine.", serviceGroupId: "8e9f0a1b-2c3d-4456-7890-abcdef123456" },
        { serviceId: "4e5f6a7b-8c9d-4012-3456-7890abcdef12", name: "PHP", description: "Popular general-purpose scripting language for web development.", serviceGroupId: "8e9f0a1b-2c3d-4456-7890-abcdef123456" },
    ];
};

// --- ServiceVersion Model ---
export class ServiceVersion extends CarpenterModel {
    static sequelizeDefinition = {
        serviceVersionId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        serviceId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key
        versionNumber: { type: DataTypes.STRING, allowNull: false, },
        isSupported: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        releaseDate: { type: DataTypes.DATEONLY, allowNull: true, },
        eolDate: { type: DataTypes.DATEONLY, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Service",
            required: true, parentParentKey: 'serviceId', childModelName: "ServiceVersion", childParentKey: 'serviceId' }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "ServiceVersion",
            required: true, childParentKey: 'serviceVersionId', childModelName: "ServiceVersionConfig" }),
        // These relationships will be defined when we discuss ServerServices and ClusterServices
        // new CarpenterModelRelationship({ connectionType: "1M", parentModelName: "ServiceVersion", required: true, childParentKey: 'serviceVersionId', childModelName: "ServerServices" }),
        // new CarpenterModelRelationship({ connectionType: "1M", parentModelName: "ServiceVersion", required: true, childParentKey: 'serviceVersionId', childModelName: "ClusterServices" }),
    ];

    static seedDataDemo = [
        { serviceVersionId: "5f6a7b8c-9d0e-4123-4567-890abcdef123", serviceId: "9f0a1b2c-3d4e-4567-8901-234567890abc", versionNumber: "1.20.1", isSupported: true, releaseDate: "2021-05-25", eolDate: null },
        { serviceVersionId: "6a7b8c9d-0e1f-4234-5678-90abcdef1234", serviceId: "9f0a1b2c-3d4e-4567-8901-234567890abc", versionNumber: "1.18.0", isSupported: false, releaseDate: "2020-04-20", eolDate: "2022-04-20" },
        { serviceVersionId: "7b8c9d0e-1f2a-4345-6789-0abcdef12345", serviceId: "1b2c3d4e-5f6a-4789-0123-4567890abcde", versionNumber: "8.0.28", isSupported: true, releaseDate: "2022-01-18", eolDate: null },
        { serviceVersionId: "8c9d0e1f-2a3b-4456-7890-abcdef123456", serviceId: "3d4e5f6a-7b8c-4901-2345-67890abcdef0", versionNumber: "16.x", isSupported: true, releaseDate: "2021-04-20", eolDate: null },
    ];
};

// --- ServiceVersionConfig Model ---
export class ServiceVersionConfig extends CarpenterModel {
    static sequelizeDefinition = {
        serviceVersionConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        serviceVersionId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key
        configKey: { type: DataTypes.STRING, allowNull: false, },
        defaultValue: { type: DataTypes.STRING, allowNull: true, },
        description: { type: DataTypes.STRING, allowNull: true, },
        dataType: { type: DataTypes.STRING, allowNull: true, },
        validationRegex: { type: DataTypes.STRING, allowNull: true, },
        enumValues: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServiceVersion",
            required: true, parentParentKey: 'serviceVersionId', childModelName: "ServiceVersionConfig", childParentKey: 'serviceVersionId' }),
    ];

    static seedDataDemo = [
        {
            serviceVersionConfigId: "9d0e1f2a-3b4c-4567-8901-234567890abc",
            serviceVersionId: "5f6a7b8c-9d0e-4123-4567-890abcdef123",
            configKey: "http_port",
            defaultValue: "80",
            description: "Default HTTP listening port for NGINX.",
            dataType: "integer",
            validationRegex: "^\\d+$",
            enumValues: null
        },
        {
            serviceVersionConfigId: "0e1f2a3b-4c5d-4678-9012-34567890abcd",
            serviceVersionId: "5f6a7b8c-9d0e-4123-4567-890abcdef123",
            configKey: "ssl_port",
            defaultValue: "443",
            description: "Default HTTPS listening port for NGINX.",
            dataType: "integer",
            validationRegex: "^\\d+$",
            enumValues: null
        },
        {
            serviceVersionConfigId: "1f2a3b4c-5d6e-4789-0123-4567890abcde",
            serviceVersionId: "7b8c9d0e-1f2a-4345-6789-0abcdef12345",
            configKey: "max_connections",
            defaultValue: "150",
            description: "Maximum number of concurrent client connections to MySQL.",
            dataType: "integer",
            validationRegex: "^\\d+$",
            enumValues: null
        },
        {
            serviceVersionConfigId: "2a3b4c5d-6e7f-4890-1234-567890abcdef",
            serviceVersionId: "8c9d0e1f-2a3b-4456-7890-abcdef123456",
            configKey: "memory_limit_mb",
            defaultValue: "2048",
            description: "Memory limit in MB for Node.js applications.",
            dataType: "integer",
            validationRegex: "^\\d+$",
            enumValues: null
        },
    ];
};