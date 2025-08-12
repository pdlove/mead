class dhcpPacket {
    xid = 0; //Semi-unique
    packetType =0;
    isRequest = false;

    useBroadcast = false;
    hwAddress = '';
    hwType = 0; //Part of Client Identifier

    serverAddress = '';
    relayAddress = ''; //If relayed
    relayHops = 0;

    clientIdentifier = '';
    clientAddress ='';

    //if (op==1) isRequest = true;

    otherOptions = {};

    constructor(options) {
        if (!options) options={};
        if (options.buffer) {
            const buf = options.buffer
            if (buf.length < 240) throw new Error('Invalid DHCP packet: too short');

            const packet = {
                op: buf.readUInt8(0), //1 = request, 2 = reply
                htype: buf.readUInt8(1), //Hardware type (usually 1 = Ethernet)
                hlen: buf.readUInt8(2), //Hardware address length (e.g., 6)
                hops: buf.readUInt8(3), //Set to 0 by client
                xid: buf.readUInt32BE(4), //Transaction ID (matches replies)
                secs: buf.readUInt16BE(8), //	Seconds since request started
                flags: buf.readUInt16BE(10), //E.g., broadcast bit
                ciaddr: buf.slice(12, 16).join('.'), //	Client IP address (if known)
                yiaddr: buf.slice(16, 20).join('.'), //	"Your" IP address (offered by server)
                siaddr: buf.slice(20, 24).join('.'), //	Server IP address
                giaddr: buf.slice(24, 28).join('.'), //	Gateway IP (for relay agents)
                chaddr: [...buf.slice(28, 28 + 16)].slice(0, buf.readUInt8(2)).map(b => b.toString(16).padStart(2, '0')).join(':'), //	Client hardware address (MAC)
                sname: buf.slice(44, 108).toString('ascii').replace(/\0/g, ''), //Optional server name
                file: buf.slice(108, 236).toString('ascii').replace(/\0/g, ''), //	Boot file name
            };

            const dchpOptions = {}
            const magicCookie = buf.slice(236, 240);
            if (!magicCookie.equals(Buffer.from([99, 130, 83, 99]))) {
                throw new Error('Invalid DHCP magic cookie');
            }

            let i = 240;
            while (i < buf.length) {
                const code = buf[i++];
                if (code === 255) break; // End Option
                if (code === 0) continue; // Pad

                const len = buf[i++];
                const data = buf.slice(i, i + len);
                i += len;

                const val = decodeOption(code, data);
                dchpOptions[getOptionName(code)] = val;
            }

            this.xid=packet.xid;
            this.packetType = dchpOptions['dhcpMessageType'];
            this.isRequest = (packet.op==1);
            this.useBroadcast = ((packet.flags&1)==1);
            this.hwAddress = packet.chaddr;
            this.serverAddress = packet.siaddr;
            this.relayAddress = packet.giaddr;
            this.relayHops = packet.hops;
            this.clientAddress = packet.ciaddr; 
            if (options['clientIdentifier']) {
                this.clientIdentifier=options['clientIdentifier'];
                this.hwType = this.clientIdentifier.substring(0,2);
            }

            delete dchpOptions.dhcpMessageType;
            this.otherOptions = dchpOptions;
        }
    }

}

const optionMap = {
    0: 'padOption', // Used for alignment (RFC 2132)
    1: 'subnetMask', // Required if using a subnet (RFC 2132)
    2: 'timeOffset', // Deprecated (UTC offset) (RFC 2132)
    3: 'router', // Default gateway(s) (RFC 2132)
    4: 'timeServer', // RFC 868 (RFC 2132)
    5: 'nameServer', // Older name resolution (RFC 2132)
    6: 'domainNameServer', // DNS (RFC 2132)
    7: 'logServer', // For syslog (RFC 2132)
    8: 'cookieServer', // Uncommon (RFC 2132)
    9: 'lprServer', // Line printer daemon (RFC 2132)
    10: 'impressServer', // Obsolete (RFC 2132)
    11: 'resourceLocationServer', // Obsolete (RFC 2132)
    12: 'hostName', // Client’s hostname (RFC 2132)
    13: 'bootFileSize', // Size of boot file in 512-byte blocks (RFC 2132)
    14: 'meritDumpFile', // Debugging info file (RFC 2132)
    15: 'domainName', // DNS domain (RFC 2132)
    16: 'swapServer', // Obsolete (RFC 2132)
    17: 'rootPath', // Boot file root (RFC 2132)
    18: 'extensionsPath', // Path to extensions (RFC 2132)
    19: 'ipForwarding', // Enable/disable (RFC 2132)
    20: 'nonLocalSourceRouting', // Boolean (RFC 2132)
    21: 'policyFilter', // Routing (RFC 2132)
    22: 'maxDatagramReassemblySize', // MTU-related (RFC 2132)
    23: 'defaultIpTtl', // IP time-to-live (RFC 2132)
    24: 'pathMtuAgingTimeout', // Seconds (RFC 2132)
    25: 'pathMtuPlateauTable', // List of MTUs (RFC 2132)
    26: 'interfaceMtu', // Max frame size (RFC 2132)
    27: 'allSubnetsAreLocal', // Boolean (RFC 2132)
    28: 'broadcastAddress', // For local broadcast (RFC 2132)
    29: 'performMaskDiscovery', // Boolean (RFC 2132)
    30: 'maskSupplier', // Boolean (RFC 2132)
    31: 'performRouterDiscovery', // Boolean (RFC 2132)
    32: 'routerSolicitationAddress', // Multicast address (RFC 2132)
    33: 'staticRoute', // List of routes (RFC 2132)
    34: 'trailerEncapsulation', // Deprecated (RFC 2132)
    35: 'arpCacheTimeout', // Seconds (RFC 2132)
    36: 'ethernetEncapsulation', // Boolean (RFC 2132)
    37: 'defaultTcpTtl', // Time-to-live (RFC 2132)
    38: 'tcpKeepaliveInterval', // Seconds (RFC 2132)
    39: 'tcpKeepaliveGarbage', // Boolean (RFC 2132)
    40: 'networkInformationServiceDomain', // NIS domain (RFC 2132)
    41: 'networkInformationServiceServers', // IPs (RFC 2132)
    42: 'ntpServers', // For time sync (RFC 2132)
    43: 'vendorSpecificInfo', // Often used by VoIP, PXE, etc. (RFC 2132)
    44: 'netbiosNameServer', // WINS (RFC 2132)
    45: 'netbiosDatagramDistServer', // NetBIOS broadcasts (RFC 2132)
    46: 'netbiosNodeType', // 1= b-node, 8=h-node (RFC 2132)
    47: 'netbiosScope', // Optional (RFC 2132)
    48: 'xWindowFontServer', // Obsolete (RFC 2132)
    49: 'xWindowManagerServer', // Obsolete (RFC 2132)
    50: 'requestedIpAddress', // Used in REQUEST (RFC 2132)
    51: 'ipAddressLeaseTime', // Seconds (RFC 2132)
    52: 'optionOverload', // Specifies that options continue in file/sname fields (RFC 2132)
    53: 'dhcpMessageType', // 1–8 (DISCOVER, OFFER, etc.) (RFC 2132)
    54: 'serverIdentifier', // Server’s IP (RFC 2132)
    55: 'parameterRequestList', // What client wants (RFC 2132)
    56: 'message', // Error messages, etc. (RFC 2132)
    57: 'maximumDhcpMessageSize', // In bytes (RFC 2132)
    58: 'renewalT1TimeValue', // When to renew lease (RFC 2132)
    59: 'rebindingT2TimeValue', // When to rebind lease (RFC 2132)
    60: 'vendorClassIdentifier', // E.g., "MSFT 5.0" (RFC 2132)
    61: 'clientIdentifier', // MAC or unique ID (RFC 2132)
    62: 'netwareIpDomainName', // For NetWare (RFC 2242)
    63: 'netwareIpInformation', // For NetWare (RFC 2242)
    64: 'tftpServerName', // For PXE boot (RFC 2132)
    65: 'bootfileName', // For PXE boot (RFC 2132)
    66: 'tftpServerNameAlternate', // Often used in VoIP (RFC 2132)
    67: 'bootfileNameAlternate', // Often used in VoIP (RFC 2132)
    68: 'mobileIpHomeAgent', // IP address(es) of Mobile IP home agent(s) (RFC 3024)
    69: 'smtpServer', // IP address(es) of SMTP (mail) server(s) (RFC 2132)
    70: 'pop3Server', // IP address(es) of POP3 mail server(s) (RFC 2132)
    71: 'nntpServer', // IP address(es) of news server(s) (RFC 2132)
    72: 'wwwServer', // IP address(es) of HTTP web server(s) (RFC 2132)
    73: 'fingerServer', // IP address(es) of finger protocol server(s) (RFC 2132)
    74: 'ircServer', // IP address(es) of IRC (chat) server(s) (RFC 2132)
    75: 'streettalkServer', // IP address(es) of StreetTalk directory servers (RFC 2132)
    76: 'streettalkDirectoryAssistanceServer', // IP address(es) of StreetTalk directory assistance (RFC 2132)
    77: 'userClass', // Like Vendor Class, but more detailed (RFC 3004)
    78: 'directoryAgent', // SLP (RFC 2610)
    79: 'serviceScope', // SLP (RFC 2610)
    80: 'rapidCommit', // Fast exchange (RFC 4039)
    81: 'clientFqdn', // Fully qualified domain name (RFC 4702)
    82: 'relayAgentInformation', // Inserted by relay (RFC 3046)
    119: 'domainSearch', // List of domains to try (RFC 3397)
    120: 'sipServers', // IP or domain (RFC 3361)
    121: 'classlessStaticRoutesMsStyle', // Better than Option 33 (RFC 3442)
    122: 'cablelabsClientConfiguration', // Vendor-specific (CableLabs)
    123: 'geoconf', // Location info (RFC 3825)
    124: 'vendorIdentifyingVendorClass', // Used for detailed identification (RFC 3925)
    125: 'vendorIdentifyingVendorSpecific', // Often use (RFC 3925)
    249: 'microsoftClasslessStaticRoutes', //Duplicate of 121 for legacy Windows Compatibility
    252: 'proxyAutoConfig', //URL to a PAC file for proxy settings
    255: 'end' // End of Option List (RFC 2132)
};

function _expandConstantObject (object) {
    var keys = [];
    for (var key in object)
        keys.push (key);
    for (var i = 0; i < keys.length; i++)
        object[object[keys[i]]] = parseInt (keys[i]);
}
_expandConstantObject(optionMap);

function getOptionName(code) {
    return optionMap[code] || `option_${code}`;
}
function getOptionCode(name) {
    optionMap.w
}
  
  function decodeOption(code, data) {
    switch (code) {
      case 1: case 3: case 6: case 50: case 54:
        return data.join('.');
      case 51: case 58: case 59:
        return data.readUInt32BE(0);
      case 53:
        return data[0]; // message type as int
      case 55:
        let myData=[];
        for (const optCode of data) {
            myData.push(getOptionName(optCode));
        }
        return myData;
      case 12: case 15: case 60:
        return data.toString('ascii').replace(/\0/g, '');
      case 61:
        return data.toString('hex').match(/../g).join(':');
      default:
        return data.toString('hex');
    }
  }
module.exports = dhcpPacket;