import { CarpenterModel, DataTypes } from "../../../carpenter/CarpenterModel.js";
import CarpenterModelRelationship from "../../../carpenter/CarpenterModelRelationship.js";
import bcrypt from 'bcrypt'; // Assuming bcrypt is installed for password hashing

const saltRounds = 10;
const hashPassword = (password) => {
    // This function is for hashing passwords in seed data
    return bcrypt.hashSync(password, saltRounds);
};

// --- Updated Cluster Model ---
export class Cluster extends CarpenterModel {
    static sequelizeDefinition = {
        clusterId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, },
        fqdn: { type: DataTypes.STRING, allowNull: true, }, // Fully Qualified Domain Name (optional)
        defaultClusterIpv4: { type: DataTypes.STRING, allowNull: true, }, // Default public/load balancer IP (optional)
        defaultClusterIpv6: { type: DataTypes.STRING, allowNull: true, }, // Default public/load balancer IPv6 (optional)
        organizationId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to organizationId
    }

    static sequelizeConnections = [
        // Cluster has many ClusterServices (1:M)
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Cluster",
            required: true, childParentKey: 'clusterId', childModelName: "ClusterServices" }),
        // Cluster has many Servers (1:M)
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Cluster",
            required: true, childParentKey: 'clusterId', childModelName: "Server" }), // Changed from "Servers" to "Server" for model name consistency
        // Cluster belongs to UserTeam (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Organization",
            required: true, parentParentKey: 'organizationId', childModelName: "Cluster", childParentKey: 'organizationId' }),
    ];

    static seedDataDemo = [
        {
            clusterId: "795c6298-7bf6-47c7-9a16-c99439f9993c",
            name: "Customer Web App",
            fqdn: "webapp.example.com",
            defaultClusterIpv4: "203.0.113.10",
            defaultClusterIpv6: "2001:0db8::10",
            organizationId: "94a72a62-3d66-4e78-a20a-14f4eae1a9de" // DEMO_TEAM_UUID
        },
        {
            clusterId: "a0ec3f73-65f5-41b6-b222-894443bc8a14",
            name: "Internal API",
            fqdn: "api.internal.example.com",
            defaultClusterIpv4: "192.168.1.5",
            defaultClusterIpv6: null,
            organizationId: "94a72a62-3d66-4e78-a20a-14f4eae1a9de" // DEMO_TEAM_UUID
        },
        {
            clusterId: "b0ec3f73-65f5-41b6-b222-894443bc8a14",
            name: "Dev Testing",
            fqdn: null,
            defaultClusterIpv4: null,
            defaultClusterIpv6: null,
            organizationId: "94a72a62-3d66-4e78-a20a-14f4eae1a9de" // DEV_TEAM_UUID
        },
    ]
};

// --- NEW: ClusterServices Model ---
export class ClusterServices extends CarpenterModel {
    static sequelizeDefinition = {
        clusterServiceId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        clusterId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to Cluster
        serviceVersionId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to ServiceVersion
        ipAddressV4: { type: DataTypes.STRING, allowNull: true, }, // Cluster-level IP for this service instance (optional)
        ipAddressV6: { type: DataTypes.STRING, allowNull: true, }, // Cluster-level IPv6 for this service instance (optional)
        // Note: Application logic will enforce at least one of ipAddressV4 or ipAddressV6 must be filled.
    }

    static sequelizeConnections = [
        // ClusterServices belongs to Cluster (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Cluster",
            required: true, parentParentKey: 'clusterId', childModelName: "ClusterServices", childParentKey: 'clusterId' }),
        // ClusterServices belongs to ServiceVersion (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServiceVersion",
            required: true, parentParentKey: 'serviceVersionId', childModelName: "ClusterServices", childParentKey: 'serviceVersionId' }),
        // ClusterServices has many ClusterServiceConfig (1:M)
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "ClusterServices",
            required: true, childParentKey: 'clusterServiceId', childModelName: "ClusterServiceConfig" }),
        // ClusterServices has many ServerService (1:M)
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "ClusterServices",
            required: true, childParentKey: 'clusterServiceId', childModelName: "ServerService" }),
    ];

    static seedDataDemo = [
        {
            clusterServiceId: "50000000-0000-0000-0000-000000000001",
            clusterId: "795c6298-7bf6-47c7-9a16-c99439f9993c", // Customer Web App Cluster
            serviceVersionId: "5f6a7b8c-9d0e-4123-4567-890abcdef123", // NGINX 1.20.1
            ipAddressV4: "198.51.100.10",
            ipAddressV6: null,
        },
        {
            clusterServiceId: "50000000-0000-0000-0000-000000000002",
            clusterId: "a0ec3f73-65f5-41b6-b222-894443bc8a14", // Internal API Cluster
            serviceVersionId: "7b8c9d0e-1f2a-4345-6789-0abcdef12345", // MySQL 8.0.28
            ipAddressV4: "192.168.1.10",
            ipAddressV6: null,
        },
        {
            clusterServiceId: "50000000-0000-0000-0000-000000000003",
            clusterId: "b0ec3f73-65f5-41b6-b222-894443bc8a14", // Dev Testing Cluster
            serviceVersionId: "8c9d0e1f-2a3b-4456-7890-abcdef123456", // Node.js 16.x
            ipAddressV4: null,
            ipAddressV6: "2001:0db8:ffff::10",
        },
    ];
};

// --- NEW: ClusterServiceConfig Model ---
export class ClusterServiceConfig extends CarpenterModel {
    static sequelizeDefinition = {
        clusterServiceConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        clusterServiceId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to ClusterServices
        configKey: { type: DataTypes.STRING, allowNull: false, },
        configValue: { type: DataTypes.STRING, allowNull: true, }, // Value to override ServiceVersionConfig's defaultValue
    }

    static sequelizeConnections = [
        // ClusterServiceConfig belongs to ClusterServices (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ClusterServices",
            required: true, parentParentKey: 'clusterServiceId', childModelName: "ClusterServiceConfig", childParentKey: 'clusterServiceId' }),
    ];

    static seedDataDemo = [
        {
            clusterServiceConfigId: "60000000-0000-0000-0000-000000000001",
            clusterServiceId: "50000000-0000-0000-0000-000000000001", // NGINX on Customer Web App
            configKey: "http_port",
            configValue: "8080", // Overriding default 80
        },
        {
            clusterServiceConfigId: "60000000-0000-0000-0000-000000000002",
            clusterServiceId: "50000000-0000-0000-0000-000000000002", // MySQL on Internal API
            configKey: "max_connections",
            configValue: "500", // Overriding default 150
        },
    ];
};

// --- NEW: Server Model ---
export class Server extends CarpenterModel {
    static sequelizeDefinition = {
        serverId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        clusterId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to Cluster
        name: { type: DataTypes.STRING, allowNull: false, },
        fqdn: { type: DataTypes.STRING, allowNull: true, }, // Fully Qualified Domain Name (optional)
        managementAddress: { type: DataTypes.STRING, allowNull: false, }, // IP or FQDN used for management (SSH, API, etc.)
        loginAccount: { type: DataTypes.STRING, allowNull: false, },
        password: { type: DataTypes.STRING, allowNull: true, }, // Blowfish encrypted password (optional)
        sshKey: { type: DataTypes.TEXT, allowNull: true, }, // Encrypted SSH private key (optional)
        // Note: Application logic will enforce that at least password or sshKey is provided for authentication.
    }

    static sequelizeConnections = [
        // Server belongs to Cluster (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Cluster",
            required: true, parentParentKey: 'clusterId', childModelName: "Server", childParentKey: 'clusterId' }),
        // Server has many ServerServices (1:M)
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Server",
            required: true, childParentKey: 'serverId', childModelName: "ServerService" }),
    ];

    static seedDataDemo = [
        {
            serverId: "70000000-0000-0000-0000-000000000001",
            clusterId: "795c6298-7bf6-47c7-9a16-c99439f9993c", // Customer Web App Cluster
            name: "web-01",
            fqdn: "web01.webapp.example.com",
            managementAddress: "10.0.0.10",
            loginAccount: "admin_user",
            password: hashPassword("ServerPass!1"),
            sshKey: null,
        },
        {
            serverId: "70000000-0000-0000-0000-000000000002",
            clusterId: "a0ec3f73-65f5-41b6-b222-894443bc8a14", // Internal API Cluster
            name: "db-01",
            fqdn: "db01.api.internal.example.com",
            managementAddress: "10.0.1.10",
            loginAccount: "db_admin",
            password: null,
            sshKey: "ENCRYPTED_SSH_KEY_FOR_DB01_123ABC", // Placeholder for an encrypted SSH key
        },
        {
            serverId: "70000000-0000-0000-0000-000000000003",
            clusterId: "b0ec3f73-65f5-41b6-b222-894443bc8a14", // Dev Testing Cluster
            name: "app-01",
            fqdn: null,
            managementAddress: "10.0.2.10",
            loginAccount: "dev_user",
            password: hashPassword("DevTestPass!"),
            sshKey: null,
        },
    ];
};

// --- NEW: ServerService Model ---
export class ServerService extends CarpenterModel {
    static sequelizeDefinition = {
        serverServiceId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        serverId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to Server
        clusterServiceId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to ClusterServices
    }

    static sequelizeConnections = [
        // ServerService belongs to Server (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Server",
            required: true, parentParentKey: 'serverId', childModelName: "ServerService", childParentKey: 'serverId' }),
        // ServerService belongs to ClusterServices (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ClusterServices",
            required: true, parentParentKey: 'clusterServiceId', childModelName: "ServerService", childParentKey: 'clusterServiceId' }),
        // ServerService has many ServerServiceConfig (1:M)
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "ServerService",
            required: true, childParentKey: 'serverServiceId', childModelName: "ServerServiceConfig" }),
    ];

    static seedDataDemo = [
        {
            serverServiceId: "80000000-0000-0000-0000-000000000001",
            serverId: "70000000-0000-0000-0000-000000000001", // web-01
            clusterServiceId: "50000000-0000-0000-0000-000000000001", // NGINX on Customer Web App Cluster
        },
        {
            serverServiceId: "80000000-0000-0000-0000-000000000002",
            serverId: "70000000-0000-0000-0000-000000000002", // db-01
            clusterServiceId: "50000000-0000-0000-0000-000000000002", // MySQL on Internal API Cluster
        },
        {
            serverServiceId: "80000000-0000-0000-0000-000000000003",
            serverId: "70000000-0000-0000-0000-000000000003", // app-01
            clusterServiceId: "50000000-0000-0000-0000-000000000003", // Node.js on Dev Testing Cluster
        },
    ];
};

// --- NEW: ServerServiceConfig Model ---
export class ServerServiceConfig extends CarpenterModel {
    static sequelizeDefinition = {
        serverServiceConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        serverServiceId: { type: DataTypes.UUID, allowNull: false, }, // Foreign key to ServerService
        configKey: { type: DataTypes.STRING, allowNull: false, },
        configValue: { type: DataTypes.STRING, allowNull: true, }, // Value to override ClusterServiceConfig/ServiceVersionConfig
    }

    static sequelizeConnections = [
        // ServerServiceConfig belongs to ServerService (M:1)
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServerService",
            required: true, parentParentKey: 'serverServiceId', childModelName: "ServerServiceConfig", childParentKey: 'serverServiceId' }),
    ];

    static seedDataDemo = [
        {
            serverServiceConfigId: "90000000-0000-0000-0000-000000000001",
            serverServiceId: "80000000-0000-0000-0000-000000000001", // NGINX on web-01
            configKey: "access_log",
            configValue: "/var/log/nginx/access.log", // Server-specific log path
        },
        {
            serverServiceConfigId: "90000000-0000-0000-0000-000000000002",
            serverServiceId: "80000000-0000-0000-0000-000000000002", // MySQL on db-01
            configKey: "innodb_buffer_pool_size",
            configValue: "2G", // Server-specific buffer pool size
        },
    ];
};