import { CarpenterModel, DataTypes } from "../../carpenter/CarpenterModel.js";
import CarpenterModelRelationship from "../../carpenter/CarpenterModelRelationship.js";
import bcrypt from 'bcrypt'; // Assuming bcrypt is installed for password hashing

const saltRounds = 10;
const hashPassword = (password) => {
    // This function is for hashing passwords in seed data
    return bcrypt.hashSync(password, saltRounds);
};

// --- Updated Cluster Model (included for context of its UUIDs being baked in) ---
export class Cluster extends CarpenterModel {
    static sequelizeDefinition = {
        clusterId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, },
        fqdn: { type: DataTypes.STRING, allowNull: true, },
        defaultClusterIpv4: { type: DataTypes.STRING, allowNull: true, },
        defaultClusterIpv6: { type: DataTypes.STRING, allowNull: true, },
        userTeamId: { type: DataTypes.UUID, allowNull: false, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Cluster",
            required: true, childParentKey: 'clusterId', childModelName: "ClusterServices" }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "Cluster",
            required: true, childParentKey: 'clusterId', childModelName: "Server" }),
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "UserTeam",
            required: true, parentParentKey: 'userTeamId', childModelName: "Cluster", childParentKey: 'userTeamId' }),
    ];

    static seedDataDemo = [
        {
            clusterId: "795c6298-7bf6-47c7-9a16-c99439f9993c",
            name: "Customer Web App",
            fqdn: "webapp.example.com",
            defaultClusterIpv4: "203.0.113.10",
            defaultClusterIpv6: "2001:0db8::10",
            userTeamId: "e2d0f1b3-5a7c-48e9-9d6f-2b1a0c3e5d4f" // DEMO_TEAM_UUID from User file
        },
        {
            clusterId: "a0ec3f73-65f5-41b6-b222-894443bc8a14",
            name: "Internal API",
            fqdn: "api.internal.example.com",
            defaultClusterIpv4: "192.168.1.5",
            defaultClusterIpv6: null,
            userTeamId: "e2d0f1b3-5a7c-48e9-9d6f-2b1a0c3e5d4f" // DEMO_TEAM_UUID from User file
        },
        {
            clusterId: "b0ec3f73-65f5-41b6-b222-894443bc8a14",
            name: "Dev Testing",
            fqdn: null,
            defaultClusterIpv4: null,
            defaultClusterIpv6: null,
            userTeamId: "f8c7b6a5-4d3e-2c1b-0a9f-8e7d6c5b4a32" // DEV_TEAM_UUID from User file
        },
    ]
};

// --- ClusterServices Model (UUIDs baked in) ---
export class ClusterServices extends CarpenterModel {
    static sequelizeDefinition = {
        clusterServiceId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        clusterId: { type: DataTypes.UUID, allowNull: false, },
        serviceVersionId: { type: DataTypes.UUID, allowNull: false, },
        ipAddressV4: { type: DataTypes.STRING, allowNull: true, },
        ipAddressV6: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Cluster",
            required: true, parentParentKey: 'clusterId', childModelName: "ClusterServices", childParentKey: 'clusterId' }),
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServiceVersion",
            required: true, parentParentKey: 'serviceVersionId', childModelName: "ClusterServices", childParentKey: 'serviceVersionId' }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "ClusterServices",
            required: true, childParentKey: 'clusterServiceId', childModelName: "ClusterServiceConfig" }),
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

// --- ClusterServiceConfig Model (UUIDs baked in) ---
export class ClusterServiceConfig extends CarpenterModel {
    static sequelizeDefinition = {
        clusterServiceConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        clusterServiceId: { type: DataTypes.UUID, allowNull: false, },
        configKey: { type: DataTypes.STRING, allowNull: false, },
        configValue: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ClusterServices",
            required: true, parentParentKey: 'clusterServiceId', childModelName: "ClusterServiceConfig", childParentKey: 'clusterServiceId' }),
    ];

    static seedDataDemo = [
        {
            clusterServiceConfigId: "60000000-0000-0000-0000-000000000001",
            clusterServiceId: "50000000-0000-0000-0000-000000000001", // NGINX on Customer Web App
            configKey: "http_port",
            configValue: "8080",
        },
        {
            clusterServiceConfigId: "60000000-0000-0000-0000-000000000002",
            clusterServiceId: "50000000-0000-0000-0000-000000000002", // MySQL on Internal API
            configKey: "max_connections",
            configValue: "500",
        },
    ];
};

// --- Server Model (UUIDs baked in) ---
export class Server extends CarpenterModel {
    static sequelizeDefinition = {
        serverId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        clusterId: { type: DataTypes.UUID, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, },
        fqdn: { type: DataTypes.STRING, allowNull: true, },
        managementAddress: { type: DataTypes.STRING, allowNull: false, },
        loginAccount: { type: DataTypes.STRING, allowNull: false, },
        password: { type: DataTypes.STRING, allowNull: true, },
        sshKey: { type: DataTypes.TEXT, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Cluster",
            required: true, parentParentKey: 'clusterId', childModelName: "Server", childParentKey: 'clusterId' }),
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
            sshKey: "ENCRYPTED_SSH_KEY_FOR_DB01_123ABC",
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

// --- ServerService Model (UUIDs baked in) ---
export class ServerService extends CarpenterModel {
    static sequelizeDefinition = {
        serverServiceId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        serverId: { type: DataTypes.UUID, allowNull: false, },
        clusterServiceId: { type: DataTypes.UUID, allowNull: false, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Server",
            required: true, parentParentKey: 'serverId', childModelName: "ServerService", childParentKey: 'serverId' }),
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ClusterServices",
            required: true, parentParentKey: 'clusterServiceId', childModelName: "ServerService", childParentKey: 'clusterServiceId' }),
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

// --- ServerServiceConfig Model (UUIDs baked in) ---
export class ServerServiceConfig extends CarpenterModel {
    static sequelizeDefinition = {
        serverServiceConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        serverServiceId: { type: DataTypes.UUID, allowNull: false, },
        configKey: { type: DataTypes.STRING, allowNull: false, },
        configValue: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServerService",
            required: true, parentParentKey: 'serverServiceId', childModelName: "ServerServiceConfig", childParentKey: 'serverServiceId' }),
    ];

    static seedDataDemo = [
        {
            serverServiceConfigId: "90000000-0000-0000-0000-000000000001",
            serverServiceId: "80000000-0000-0000-0000-000000000001", // NGINX on web-01
            configKey: "access_log",
            configValue: "/var/log/nginx/access.log",
        },
        {
            serverServiceConfigId: "90000000-0000-0000-0000-000000000002",
            serverServiceId: "80000000-0000-0000-0000-000000000002", // MySQL on db-01
            configKey: "innodb_buffer_pool_size",
            configValue: "2G",
        },
    ];
};

// --- WebApp Model (UUIDs baked in) ---
export class WebApp extends CarpenterModel {
    static sequelizeDefinition = {
        webAppId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, },
        fqdn: { type: DataTypes.STRING, allowNull: true, unique: true },
        deploymentProcess: { type: DataTypes.ENUM('All at once', 'One by One'), allowNull: false, },
        deploymentWebhookUuid: { type: DataTypes.UUID, allowNull: true, },
        deploymentWebhookSecret: { type: DataTypes.STRING, allowNull: true, },

        sourceType: { type: DataTypes.ENUM('Git', 'Static', 'FTP', 'SFTP'), allowNull: false, },
        sourceAddress: { type: DataTypes.STRING, allowNull: false, },
        sourceUsername: { type: DataTypes.STRING, allowNull: true, },
        sourcePassword: { type: DataTypes.STRING, allowNull: true, },
        sourceSshKey: { type: DataTypes.TEXT, allowNull: true, },

        clusterId: { type: DataTypes.UUID, allowNull: false, },
        clusterServiceId: { type: DataTypes.UUID, allowNull: false, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "Cluster",
            required: true, parentParentKey: 'clusterId', childModelName: "WebApp", childParentKey: 'clusterId' }),
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ClusterServices",
            required: true, parentParentKey: 'clusterServiceId', childModelName: "WebApp", childParentKey: 'clusterServiceId' }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "WebApp",
            required: true, childParentKey: 'webAppId', childModelName: "DeploymentLog" }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "WebApp",
            required: true, childParentKey: 'webAppId', childModelName: "WebAppConfig" }),
    ];

    static seedDataDemo = [
        {
            webAppId: "a0000000-0000-0000-0000-000000000001",
            name: "MyEcommerceSite",
            fqdn: "shop.example.com",
            deploymentProcess: "All at once",
            deploymentWebhookUuid: "11223344-5566-7788-9900-aabbccddeeff",
            deploymentWebhookSecret: "superSecureWebhookSecret123",
            sourceType: "Git",
            sourceAddress: "git@github.com:myorg/ecommerce.git",
            sourceUsername: null,
            sourcePassword: null,
            sourceSshKey: "ENCRYPTED_GIT_SSH_KEY_ECOMMERCE",
            clusterId: "795c6298-7bf6-47c7-9a16-c99439f9993c", // Customer Web App Cluster
            clusterServiceId: "50000000-0000-0000-0000-000000000001", // NGINX on CWA
        },
        {
            webAppId: "a0000000-0000-0000-0000-000000000002",
            name: "CompanyBlog",
            fqdn: "blog.example.com",
            deploymentProcess: "One by One",
            deploymentWebhookUuid: null,
            deploymentWebhookSecret: null,
            sourceType: "FTP",
            sourceAddress: "ftp.example.com",
            sourceUsername: "bloguser",
            sourcePassword: hashPassword("Ftpl@g1N"),
            sourceSshKey: null,
            clusterId: "795c6298-7bf6-47c7-9a16-c99439f9993c", // Customer Web App Cluster
            clusterServiceId: "50000000-0000-0000-0000-000000000001", // NGINX on CWA
        },
    ];
};

// --- DeploymentLog Table (UUIDs baked in) ---
export class DeploymentLog extends CarpenterModel {
    static sequelizeDefinition = {
        deploymentLogId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        webAppId: { type: DataTypes.UUID, allowNull: false, },
        timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        status: { type: DataTypes.ENUM('success', 'partial', 'failure'), allowNull: false, },
        logOutput: { type: DataTypes.TEXT, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "WebApp",
            required: true, parentParentKey: 'webAppId', childModelName: "DeploymentLog", childParentKey: 'webAppId' }),
    ];

    static seedDataDemo = [
        {
            deploymentLogId: "b0000000-0000-0000-0000-000000000001",
            webAppId: "a0000000-0000-0000-0000-000000000001", // MyEcommerceSite
            timestamp: new Date('2023-10-26T10:00:00Z'),
            status: "success",
            logOutput: "Deployment of MyEcommerceSite version 1.0.0 completed successfully.",
        },
        {
            deploymentLogId: "b0000000-0000-0000-0000-000000000002",
            webAppId: "a0000000-0000-0000-0000-000000000001", // MyEcommerceSite
            timestamp: new Date('2023-11-15T14:30:00Z'),
            status: "failure",
            logOutput: "Deployment of MyEcommerceSite version 1.0.1 failed: Database migration error.",
        },
    ];
};

// --- WebAppConfig Table (UUIDs baked in) ---
export class WebAppConfig extends CarpenterModel {
    static sequelizeDefinition = {
        webAppConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        webAppId: { type: DataTypes.UUID, allowNull: false, },
        configKey: { type: DataTypes.STRING, allowNull: false, },
        configValue: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "WebApp",
            required: true, parentParentKey: 'webAppId', childModelName: "WebAppConfig", childParentKey: 'webAppId' }),
    ];

    static seedDataDemo = [
        {
            webAppConfigId: "c0000000-0000-0000-0000-000000000001",
            webAppId: "a0000000-0000-0000-0000-000000000001", // MyEcommerceSite
            configKey: "STRIPE_API_KEY",
            configValue: "sk_live_xyz123abc",
        },
        {
            webAppConfigId: "c0000000-0000-0000-0000-000000000002",
            webAppId: "a0000000-0000-0000-0000-000000000002", // CompanyBlog
            configKey: "DATABASE_HOST",
            configValue: "db.blog-cluster.local",
        },
    ];
};

// --- WebAppTemplateGroup Table (UUIDs baked in) ---
export class WebAppTemplateGroup extends CarpenterModel {
    static sequelizeDefinition = {
        webAppTemplateGroupId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "WebAppTemplateGroup",
            required: true, childParentKey: 'webAppTemplateGroupId', childModelName: "WebAppTemplate" }),
    ];

    static seedDataDemo = [
        { webAppTemplateGroupId: "d0000000-0000-0000-0000-000000000001", name: "E-commerce Applications", description: "Templates for online stores and shopping carts." },
        { webAppTemplateGroupId: "d0000000-0000-0000-0000-000000000002", name: "Content Management Systems", description: "Templates for blogs, news sites, and static content." },
    ];
};

// --- WebAppTemplate Table (UUIDs baked in) ---
export class WebAppTemplate extends CarpenterModel {
    static sequelizeDefinition = {
        webAppTemplateId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        name: { type: DataTypes.STRING, allowNull: false, unique: true },
        description: { type: DataTypes.STRING, allowNull: true, },
        webAppTemplateGroupId: { type: DataTypes.UUID, allowNull: false, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "WebAppTemplateGroup",
            required: true, parentParentKey: 'webAppTemplateGroupId', childModelName: "WebAppTemplate", childParentKey: 'webAppTemplateGroupId' }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "WebAppTemplate",
            required: true, childParentKey: 'webAppTemplateId', childModelName: "WebAppTemplateRequiredService" }),
        new CarpenterModelRelationship({ connectionType: "1M",
            parentModelName: "WebAppTemplate",
            required: true, childParentKey: 'webAppTemplateId', childModelName: "WebAppTemplateConfig" }),
    ];

    static seedDataDemo = [
        {
            webAppTemplateId: "e0000000-0000-0000-0000-000000000001",
            name: "Node.js E-commerce Microservice",
            description: "A scalable Node.js application template for e-commerce backend.",
            webAppTemplateGroupId: "d0000000-0000-0000-0000-000000000001", // E-commerce Applications
        },
        {
            webAppTemplateId: "e0000000-0000-0000-0000-000000000002",
            name: "PHP WordPress Blog Template",
            description: "A common PHP-based blog template, ideal for content sites.",
            webAppTemplateGroupId: "d0000000-0000-0000-0000-000000000002", // Content Management Systems
        },
    ];
};

// --- WebAppTemplateRequiredService Table (UUIDs baked in) ---
export class WebAppTemplateRequiredService extends CarpenterModel {
    static sequelizeDefinition = {
        webAppTemplateRequiredServiceId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        webAppTemplateId: { type: DataTypes.UUID, allowNull: false, },
        serviceVersionId: { type: DataTypes.UUID, allowNull: false, },
        isPrimaryService: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "WebAppTemplate",
            required: true, parentParentKey: 'webAppTemplateId', childModelName: "WebAppTemplateRequiredService", childParentKey: 'webAppTemplateId' }),
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "ServiceVersion",
            required: true, parentParentKey: 'serviceVersionId', childModelName: "WebAppTemplateRequiredService", childParentKey: 'serviceVersionId' }),
    ];

    static seedDataDemo = [
        {
            webAppTemplateRequiredServiceId: "f0000000-0000-0000-0000-000000000001",
            webAppTemplateId: "e0000000-0000-0000-0000-000000000001", // Node.js E-commerce Microservice
            serviceVersionId: "5f6a7b8c-9d0e-4123-4567-890abcdef123", // NGINX 1.20.1
            isPrimaryService: true,
        },
        {
            webAppTemplateRequiredServiceId: "f0000000-0000-0000-0000-000000000002",
            webAppTemplateId: "e0000000-0000-0000-0000-000000000001", // Node.js E-commerce Microservice
            serviceVersionId: "8c9d0e1f-2a3b-4456-7890-abcdef123456", // Node.js 16.x
            isPrimaryService: false,
        },
        {
            webAppTemplateRequiredServiceId: "f0000000-0000-0000-0000-000000000003",
            webAppTemplateId: "e0000000-0000-0000-0000-000000000002", // PHP WordPress Blog Template
            serviceVersionId: "7b8c9d0e-1f2a-4345-6789-0abcdef12345", // MySQL 8.0.28
            isPrimaryService: false,
        },
    ];
};

// --- WebAppTemplateConfig Table (UUIDs baked in) ---
export class WebAppTemplateConfig extends CarpenterModel {
    static sequelizeDefinition = {
        webAppTemplateConfigId: { type: DataTypes.UUID, primaryKey: true, allowNull: false, },
        webAppTemplateId: { type: DataTypes.UUID, allowNull: false, },
        configKey: { type: DataTypes.STRING, allowNull: false, },
        defaultValue: { type: DataTypes.STRING, allowNull: true, },
        description: { type: DataTypes.STRING, allowNull: true, },
        dataType: { type: DataTypes.STRING, allowNull: true, },
        validationRegex: { type: DataTypes.STRING, allowNull: true, },
        enumValues: { type: DataTypes.STRING, allowNull: true, },
    }

    static sequelizeConnections = [
        new CarpenterModelRelationship({ connectionType: "M1",
            parentModelName: "WebAppTemplate",
            required: true, parentParentKey: 'webAppTemplateId', childModelName: "WebAppTemplateConfig", childParentKey: 'webAppTemplateId' }),
    ];

    static seedDataDemo = [
        {
            webAppTemplateConfigId: "g0000000-0000-0000-0000-000000000001",
            webAppTemplateId: "e0000000-0000-0000-0000-000000000001", // Node.js E-commerce Microservice
            configKey: "APP_PORT",
            defaultValue: "3000",
            description: "Port on which the Node.js application listens.",
            dataType: "integer",
            validationRegex: "^\\d+$",
            enumValues: null,
        },
        {
            webAppTemplateConfigId: "g0000000-0000-0000-0000-000000000002",
            webAppTemplateId: "e0000000-0000-0000-0000-000000000002", // PHP WordPress Blog Template
            configKey: "WORDPRESS_ADMIN_EMAIL",
            defaultValue: "admin@example.com",
            description: "Default administrator email for the WordPress installation.",
            dataType: "string",
            validationRegex: "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$",
            enumValues: null,
        },
    ];
};