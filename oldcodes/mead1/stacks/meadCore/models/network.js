const { HotspringModel, DataTypes } = require('hotspring-framework');
class Network extends HotspringModel {
  static modelName = 'network';
  static sequelizeDefinition = {
    networkID: { type: DataTypes.UUIDV4, primaryKey: true },
    locationID: { type: DataTypes.UUIDV4, allowNull: false },
    vlanID: { type: DataTypes.UUIDV4, allowNull: false },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    ipv4Cidr: { type: DataTypes.STRING, allowNull: false },
    ipv4DefaultGateway: DataTypes.STRING,
    ipv4DefaultDnsServers: DataTypes.STRING,
    ipv6Cidr: DataTypes.STRING,
    ipv6DefaultGateway: DataTypes.STRING,
    ipv6DnsServers: DataTypes.STRING,
    lastSeenAt: DataTypes.DATE
  };

  static seedData = [
    {
      "networkID": "186b357a-6ce1-46e8-9ed2-11b65c9cce0b",
      "locationID": "88767b74-cce7-4ba2-b86c-c3fc7d67bcd9",
      "vlanID": "ddd3e3fa-1a11-40cd-8654-012bf314091e  ",
      "name": "Site 2 - internal",
      "description": "",
      "ipv4Cidr": "192.168.11.0/24",
      "ipv4DefaultGateway": "192.168.11.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "92c742f4-ef34-4ccf-9421-27169fa3294e",
      "locationID": "88767b74-cce7-4ba2-b86c-c3fc7d67bcd9",
      "vlanID": "1796a73e-9892-4cb4-8b4a-d92be6d68a3b  ",
      "name": "Site 2 - utility",
      "description": "",
      "ipv4Cidr": "192.168.12.0/24",
      "ipv4DefaultGateway": "192.168.12.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "f10f4cf1-ef08-4f04-bc31-f17606e1e4d4",
      "locationID": "88767b74-cce7-4ba2-b86c-c3fc7d67bcd9",
      "vlanID": "b8d509f2-9fbd-4b5d-a04d-bf874a13ab8f  ",
      "name": "Site 2 - server",
      "description": "",
      "ipv4Cidr": "192.168.13.0/24",
      "ipv4DefaultGateway": "192.168.13.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "ad6450c3-315f-43bf-8e91-29a91247ba52",
      "locationID": "88767b74-cce7-4ba2-b86c-c3fc7d67bcd9",
      "vlanID": "b1bb0db1-31df-4d36-9104-1fe34567f41b  ",
      "name": "Site 2 - plc",
      "description": "",
      "ipv4Cidr": "192.168.14.0/24",
      "ipv4DefaultGateway": "192.168.14.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "816c2408-021d-4433-b38c-2e9e366541fd",
      "locationID": "88767b74-cce7-4ba2-b86c-c3fc7d67bcd9",
      "vlanID": "e214233a-4e4e-4bcb-96ed-5a007f7aa384  ",
      "name": "Site 2 - cameras",
      "description": "",
      "ipv4Cidr": "192.168.15.0/24",
      "ipv4DefaultGateway": "192.168.15.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "e03a95c7-874a-4548-86e3-c8ca862aab16",
      "locationID": "915b2e80-5138-4962-9aef-045d4ffe9202",
      "vlanID": "ddd3e3fa-1a11-40cd-8654-012bf314091e  ",
      "name": "Site 3 - internal",
      "description": "",
      "ipv4Cidr": "192.168.21.0/24",
      "ipv4DefaultGateway": "192.168.21.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "c4498540-b98a-47e1-a18e-a84a2bef5c71",
      "locationID": "915b2e80-5138-4962-9aef-045d4ffe9202",
      "vlanID": "1796a73e-9892-4cb4-8b4a-d92be6d68a3b  ",
      "name": "Site 3 - utility",
      "description": "",
      "ipv4Cidr": "192.168.22.0/24",
      "ipv4DefaultGateway": "192.168.22.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "714ad5f2-cbae-48ae-89da-60cb5fe37a62",
      "locationID": "915b2e80-5138-4962-9aef-045d4ffe9202",
      "vlanID": "b8d509f2-9fbd-4b5d-a04d-bf874a13ab8f  ",
      "name": "Site 3 - server",
      "description": "",
      "ipv4Cidr": "192.168.23.0/24",
      "ipv4DefaultGateway": "192.168.23.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "c57d42bb-2bc3-4a37-9cad-42ce9c5e8612",
      "locationID": "915b2e80-5138-4962-9aef-045d4ffe9202",
      "vlanID": "b1bb0db1-31df-4d36-9104-1fe34567f41b  ",
      "name": "Site 3 - plc",
      "description": "",
      "ipv4Cidr": "192.168.24.0/24",
      "ipv4DefaultGateway": "192.168.24.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "a2811997-1a68-401d-8aab-05de26bac1e8",
      "locationID": "915b2e80-5138-4962-9aef-045d4ffe9202",
      "vlanID": "e214233a-4e4e-4bcb-96ed-5a007f7aa384  ",
      "name": "Site 3 - cameras",
      "description": "",
      "ipv4Cidr": "192.168.25.0/24",
      "ipv4DefaultGateway": "192.168.25.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "c52cda13-c499-4603-942c-fe45ba8609d3",
      "locationID": "e30f267d-b554-4914-a9b0-03e5689774af",
      "vlanID": "ddd3e3fa-1a11-40cd-8654-012bf314091e  ",
      "name": "Site 4 - internal",
      "description": "",
      "ipv4Cidr": "192.168.31.0/24",
      "ipv4DefaultGateway": "192.168.31.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "2ca5f9d4-c3cf-495e-8cf2-f24d4f9c93b0",
      "locationID": "e30f267d-b554-4914-a9b0-03e5689774af",
      "vlanID": "1796a73e-9892-4cb4-8b4a-d92be6d68a3b  ",
      "name": "Site 4 - utility",
      "description": "",
      "ipv4Cidr": "192.168.32.0/24",
      "ipv4DefaultGateway": "192.168.32.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "d0d85ab4-d805-4d1d-9ca6-a5e7c2b63410",
      "locationID": "e30f267d-b554-4914-a9b0-03e5689774af",
      "vlanID": "b8d509f2-9fbd-4b5d-a04d-bf874a13ab8f  ",
      "name": "Site 4 - server",
      "description": "",
      "ipv4Cidr": "192.168.33.0/24",
      "ipv4DefaultGateway": "192.168.33.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "c6b47f6f-df35-449e-99b3-ec06a132ce0f",
      "locationID": "e30f267d-b554-4914-a9b0-03e5689774af",
      "vlanID": "b1bb0db1-31df-4d36-9104-1fe34567f41b  ",
      "name": "Site 4 - plc",
      "description": "",
      "ipv4Cidr": "192.168.34.0/24",
      "ipv4DefaultGateway": "192.168.34.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "edf83647-9b90-4852-9439-08c9105f2e9b",
      "locationID": "e30f267d-b554-4914-a9b0-03e5689774af",
      "vlanID": "e214233a-4e4e-4bcb-96ed-5a007f7aa384  ",
      "name": "Site 4 - cameras",
      "description": "",
      "ipv4Cidr": "192.168.35.0/24",
      "ipv4DefaultGateway": "192.168.35.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "3ed2cd67-3046-4025-a2f9-9fa21e412d33",
      "locationID": "16b5fd32-7139-496b-ae29-ec3613647559",
      "vlanID": "ddd3e3fa-1a11-40cd-8654-012bf314091e  ",
      "name": "Corporate - internal",
      "description": "",
      "ipv4Cidr": "192.168.1.0/24",
      "ipv4DefaultGateway": "192.168.1.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "37ff8e80-5ea2-4657-8a49-eb8b9788cc59",
      "locationID": "16b5fd32-7139-496b-ae29-ec3613647559",
      "vlanID": "b8d509f2-9fbd-4b5d-a04d-bf874a13ab8f  ",
      "name": "Corporate - server",
      "description": "",
      "ipv4Cidr": "192.168.2.0/24",
      "ipv4DefaultGateway": "192.168.2.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "7c67484f-77fb-43c9-961e-8add8914db65",
      "locationID": "16b5fd32-7139-496b-ae29-ec3613647559",
      "vlanID": "e214233a-4e4e-4bcb-96ed-5a007f7aa384  ",
      "name": "Corporate - cameras",
      "description": "",
      "ipv4Cidr": "192.168.3.0/24",
      "ipv4DefaultGateway": "192.168.3.1",
      "ipv4DefaultDnsServers": "[192.168.2.11,192.168.13.11]"
    },
    {
      "networkID": "047dbb66-3b43-4ad1-a9ce-87bdea2ab089",
      "locationID": "9f37eac1-e839-450e-9fba-a198a7a4a7eb",
      "vlanID": "0f5de6fa-3ab3-4fcb-b5f2-9eb81d90f337  ",
      "name": "Corporate - internal",
      "description": "",
      "ipv4Cidr": "10.0.0.0/24",
      "ipv4DefaultGateway": "10.0.0.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "e6bf1380-06dd-4a27-994c-1e161ef0a20a",
      "locationID": "9f37eac1-e839-450e-9fba-a198a7a4a7eb",
      "vlanID": "80b594ef-1240-4e68-9bc7-5c2cfba20155  ",
      "name": "Corporate - server",
      "description": "",
      "ipv4Cidr": "10.1.0.0/24",
      "ipv4DefaultGateway": "10.1.0.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "b269552e-e820-40e2-ac26-bcfedba7dd0d",
      "locationID": "9f37eac1-e839-450e-9fba-a198a7a4a7eb",
      "vlanID": "39b18734-6b94-4e96-9406-98656a4a4ef3  ",
      "name": "Corporate - guest",
      "description": "",
      "ipv4Cidr": "192.168.1./24",
      "ipv4DefaultGateway": "192.168.1.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "8215b5c8-d8a8-4698-a723-a19335bbbbf7",
      "locationID": "9f37eac1-e839-450e-9fba-a198a7a4a7eb",
      "vlanID": "71642b56-e394-4d30-bf2b-926cc2cd2a2e  ",
      "name": "Corporate - testenv1",
      "description": "",
      "ipv4Cidr": "192.168.98.0/24",
      "ipv4DefaultGateway": "192.168.98.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "290131bf-f041-4fa1-b6a7-ac99b7a21cdb",
      "locationID": "9f37eac1-e839-450e-9fba-a198a7a4a7eb",
      "vlanID": "052c8329-0a26-4b3d-8bb9-2edc9a06340f  ",
      "name": "Corporate - testenv2",
      "description": "",
      "ipv4Cidr": "192.168.99.0/24",
      "ipv4DefaultGateway": "192.168.99.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "b21115f7-014c-4aa9-b846-5988889995d3",
      "locationID": "31d55320-d0de-42bf-9cb5-c2a7549a16de",
      "vlanID": "0f5de6fa-3ab3-4fcb-b5f2-9eb81d90f337  ",
      "name": "Sales Pit - internal",
      "description": "",
      "ipv4Cidr": "10.0.1.0/24",
      "ipv4DefaultGateway": "10.0.1.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "52fdef4b-c7c0-4c29-a7e1-174f859834aa",
      "locationID": "31d55320-d0de-42bf-9cb5-c2a7549a16de",
      "vlanID": "39b18734-6b94-4e96-9406-98656a4a4ef3  ",
      "name": "Sales Pit - guest",
      "description": "",
      "ipv4Cidr": "192.168.1.0/24",
      "ipv4DefaultGateway": "192.168.1.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "977b9298-2a8f-4338-8a74-60053b2188e2",
      "locationID": "795c6298-7bf6-47c7-9a16-c99439f9993c",
      "vlanID": "f2c15b97-1d2e-49ea-a63a-b3d59aa0d0d9  ",
      "name": "Corporate Headquarters - default",
      "description": "",
      "ipv4Cidr": "10.0.42.0/24",      
      "ipv4DefaultGateway": "10.0.42.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "587b6d04-d659-4d99-a2e8-e3d7af204c2f",
      "locationID": "795c6298-7bf6-47c7-9a16-c99439f9993c",
      "vlanID": "4c82d263-9f43-4c5c-8502-d061a878388f  ",
      "name": "Corporate Headquarters - test",
      "description": "",
      "ipv4Cidr": "192.168.99.0/24",
      "ipv4DefaultGateway": "192.168.99.1",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "ce01fa5e-b32a-49ee-8b7c-d4c7e02c71a6",
      "locationID": "795c6298-7bf6-47c7-9a16-c99439f9993c",
      "vlanID": "0c059404-ea00-4bdb-a3b3-1590e1705bb1  ",
      "name": "Corporate Headquarters - demo",
      "description": "",
      "ipv4Cidr": "192.168.1.0/24",
      "ipv4DefaultGateway": "192.168.1.1",
      "ipv4DefaultDnsServers": "[192.168.1.11,192.168.1.12,192.168.2.11]"
    },
    {
      "networkID": "f772e36c-0168-4635-99bd-bd358e65024c",
      "locationID": "260a23ee-a787-4001-a4de-79a601bbe451",
      "vlanID": "3dc947e9-b6a3-4b3d-a21a-e9b7a716e4fc  ",
      "name": "San Diego - internal",
      "description": "1",
      "ipv4Cidr": "172.16.1.0/24",
      "ipv4DefaultGateway": "172.16.1.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "1ab0b6bc-39ee-4ad1-9d54-927890c4270e",
      "locationID": "260a23ee-a787-4001-a4de-79a601bbe451",
      "vlanID": "e5b624f6-2eb2-4c84-87f0-00411f56b4a7  ",
      "name": "San Diego - guest",
      "description": "1",
      "ipv4Cidr": "192.168.1.0/24",
      "ipv4DefaultGateway": "192.168.1.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "d32fef9d-2d95-4ba7-bdbf-e4e32ee1621f",
      "locationID": "c48b4177-92bc-40dd-85f0-535485f63f63",
      "vlanID": "3dc947e9-b6a3-4b3d-a21a-e9b7a716e4fc  ",
      "name": "Houston - internal",
      "description": "2",
      "ipv4Cidr": "172.16.2.0/24",
      "ipv4DefaultGateway": "172.16.2.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "6f28ace3-47a7-439e-b266-2fc4981e2998",
      "locationID": "c48b4177-92bc-40dd-85f0-535485f63f63",
      "vlanID": "e5b624f6-2eb2-4c84-87f0-00411f56b4a7  ",
      "name": "Houston - guest",
      "description": "2",
      "ipv4Cidr": "192.168.2.0/24",
      "ipv4DefaultGateway": "192.168.2.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "972a0e3e-acbf-4afa-b7fd-e6afaf4ffab3",
      "locationID": "3fd7d3a5-c07d-4180-a31e-f860c194348a",
      "vlanID": "3dc947e9-b6a3-4b3d-a21a-e9b7a716e4fc  ",
      "name": "New York - internal",
      "description": "3",
      "ipv4Cidr": "172.16.3.0/24",
      "ipv4DefaultGateway": "172.16.3.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "48aa5cf9-8c1d-4c83-a8d7-c9fc062b5a88",
      "locationID": "3fd7d3a5-c07d-4180-a31e-f860c194348a",
      "vlanID": "e5b624f6-2eb2-4c84-87f0-00411f56b4a7  ",
      "name": "New York - guest",
      "description": "3",
      "ipv4Cidr": "192.168.3.0/24",
      "ipv4DefaultGateway": "192.168.3.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "b06a33c6-caee-4709-8a2c-4b41a967ad45",
      "locationID": "18035ab3-ea54-47d4-aa20-2eb98bfef3e8",
      "vlanID": "3dc947e9-b6a3-4b3d-a21a-e9b7a716e4fc  ",
      "name": "Miami - internal",
      "description": "4",
      "ipv4Cidr": "172.16.4.0/24",
      "ipv4DefaultGateway": "172.16.4.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    },
    {
      "networkID": "ce56683d-bccb-4104-b3f5-0812884be6f2",
      "locationID": "18035ab3-ea54-47d4-aa20-2eb98bfef3e8",
      "vlanID": "e5b624f6-2eb2-4c84-87f0-00411f56b4a7  ",
      "name": "Miami - guest",
      "description": "4",
      "ipv4Cidr": "192.168.4.0/24",
      "ipv4DefaultGateway": "192.168.4.254",
      "ipv4DefaultDnsServers": "[8.8.8.8,8.8.4.4]"
    }
  ];
}

module.exports = Network;