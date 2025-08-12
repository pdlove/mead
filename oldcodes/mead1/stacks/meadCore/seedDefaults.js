module.exports = async ({ sequelize, models }) => {
  const { Lookup, Organization, Location, VLAN, Network } = models;

  // Seed Lookup entries
  const lookups = [
    {
      category: "security_level",
      code: "1",
      name: "Public / Guest",
      description: "Open or restricted only by auth; e.g., guest Wi-Fi",
    },
    {
      category: "security_level",
      code: "2",
      name: "Internal General User",
      description: "Standard employee or user traffic",
    },
    {
      category: "security_level",
      code: "3",
      name: "Internal Sensitive",
      description: "HR, Finance, or systems with PII/PCI",
    },
    {
      category: "security_level",
      code: "4",
      name: "Admin-only",
      description: "Network or server admin access only",
    },
    {
      category: "security_level",
      code: "5",
      name: "Management Network",
      description: "For out-of-band (OOB) device management",
    },
    {
      category: "security_level",
      code: "6",
      name: "High Security / Secure Ops",
      description: "Critical infrastructure, SOC, etc.",
    },

    {
      category: "connection_type",
      code: "ethernet",
      name: "Ethernet",
      description: "Standard wired ethernet connection",
    },
    {
      category: "connection_type",
      code: "fiber",
      name: "Fiber",
      description: "Fiber optic connection",
    },
    {
      category: "connection_type",
      code: "wireless",
      name: "Wireless",
      description: "Wi-Fi or radio connection",
    },
  ];

  for (const entry of lookups) {
    await Lookup.findOrCreate({
      where: { category: entry.category, code: entry.code },
      defaults: entry,
    });
  }

  // Seed Organization
  const [org] = await Organization.findOrCreate({
    where: { name: "Demo Organization" },
    defaults: {
      description: "This is a seeded demo organization.",
      billingContactEmail: "billing@demo.org",
      technicalContactEmail: "tech@demo.org",
    },
  });

  // Seed Location
  const [location] = await Location.findOrCreate({
    where: { name: "Headquarters" },
    defaults: {
      organizationID: org.organizationID,
      address: "123 Main St, Anytown, USA",
      latitude: 37.7749,
      longitude: -122.4194,
      technicalContact: "Jane Doe",
      technicalContactEmail: "jane.doe@demo.org",
      schedulingContact: "John Smith",
      schedulingContactEmail: "john.smith@demo.org",
    },
  });

  // Seed VLAN
  const [vlan] = await VLAN.findOrCreate({
    where: { vlanID: 10, organizationID: org.organizationID },
    defaults: {
      name: "User VLAN",
      description: "VLAN for general users",
      securityLevelID: 2, // Internal General User
    },
  });

  // Seed Network
  await Network.findOrCreate({
    where: { name: "Demo Network" },
    defaults: {
      locationID: location.locationID,
      vlanID: vlan.vlanID,
      ipv4Cidr: "192.168.1.0/24",
      ipv4DefaultGateway: "192.168.1.1",
      ipv4DefaultDnsServers: "8.8.8.8,8.8.4.4",
      ipv6Cidr: "fd00::/64",
      ipv6DefaultGateway: "fd00::1",
      ipv6DnsServers: "2001:4860:4860::8888,2001:4860:4860::8844",
      description: "Demo seeded network",
    },
  });

  console.log(
    "Seeded lookup tables, organization, location, VLAN, and network."
  );
};
