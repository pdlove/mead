mibs['IF-MIB'] = {
    OID: '1.3.6.1.2.1.31',
    type: 'MIB',
    description: "The MIB module to describe generic objects for network interface sub-layers. This MIB is an updated version of MIB-II's ifTable, and incorporates the extensions defined in RFC 1229.",
    children: {
        ifMIBObjects: {
            OID: '1.3.6.1.2.1.31.1',
            type: 'group',
            description: 'Objects for the Interface MIB. (Implicit description from context)',
            children: {
                ifTableLastChange: {
                    OID: '1.3.6.1.2.1.31.1.5',
                    type: 'TimeTicks',
                    writable: false,
                    syntax: 'TimeTicks',
                    description: "The value of sysUpTime at the time of the last creation or deletion of an entry in the ifTable. If the number of entries has been unchanged since the last re-initialization of the local network management subsystem, then this object contains a zero value."
                },
                ifXTable: {
                    OID: '1.3.6.1.2.1.31.1.1',
                    type: 'table',
                    description: "A list of interface entries. The number of entries is given by the value of ifNumber. This table contains additional objects for the interface table.",
                    children: {
                        ifXEntry: {
                            OID: '1.3.6.1.2.1.31.1.1.1',
                            type: 'row',
                            rowIndex: 'ifIndex',
                            description: "An entry containing additional management information applicable to a particular interface.",
                            children: {
                                ifName: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.1',
                                    type: 'string',
                                    writable: false,
                                    syntax: 'DisplayString',
                                    description: "The textual name of the interface. The value of this object should be the name of the interface as assigned by the local device and should be suitable for use in commands entered at the device's `console'. This might be a text name, such as `le0' or a simple port number, such as `1', depending on the interface naming syntax of the device. If several entries in the ifTable together represent a single interface as named by the device, then each will have the same value of ifName. Note that for an agent which responds to SNMP queries concerning an interface on some other (proxied) device, then the value of ifName for such an interface is the proxied device's local name for it. If there is no local name, or this object is otherwise not applicable, then this object contains a zero-length string."
                                },
                                ifInMulticastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.2',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were addressed to a multicast address at this sub-layer. For a MAC layer protocol, this includes both Group and Functional addresses. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifInBroadcastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.3',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were addressed to a broadcast address at this sub-layer. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutMulticastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.4',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were addressed to a multicast address at this sub-layer, including those that were discarded or not sent. For a MAC layer protocol, this includes both Group and Functional addresses. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutBroadcastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.5',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were addressed to a broadcast address at this sub-layer, including those that were discarded or not sent. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCInOctets: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.6',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The total number of octets received on the interface, including framing characters. This object is a 64-bit version of ifInOctets. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCInUcastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.7',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were not addressed to a multicast or broadcast address at this sub-layer. This object is a 64-bit version of ifInUcastPkts. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCInMulticastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.8',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were addressed to a multicast address at this sub-layer. For a MAC layer protocol, this includes both Group and Functional addresses. This object is a 64-bit version of ifInMulticastPkts. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCInBroadcastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.9',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were addressed to a broadcast address at this sub-layer. This object is a 64-bit version of ifInBroadcastPkts. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCOutOctets: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.10',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The total number of octets transmitted out of the interface, including framing characters. This object is a 64-bit version of ifOutOctets. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCOutUcastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.11',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were not addressed to a multicast or broadcast address at this sub-layer, including those that were discarded or not sent. This object is a 64-bit version of ifOutUcastPkts. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCOutMulticastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.12',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were addressed to a multicast address at this sub-layer, including those that were discarded or not sent. For a MAC layer protocol, this includes both Group and Functional addresses. This object is a 64-bit version of ifOutMulticastPkts. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifHCOutBroadcastPkts: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.13',
                                    type: 'Counter64',
                                    writable: false,
                                    syntax: 'Counter64',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were addressed to a broadcast address at this sub-layer, including those that were discarded or not sent. This object is a 64-bit version of ifOutBroadcastPkts. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifLinkUpDownTrapEnable: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.14',
                                    type: 'enum',
                                    writable: true,
                                    enum: {
                                        1: 'enabled',
                                        2: 'disabled'
                                    },
                                    syntax: 'INTEGER { enabled(1), disabled(2) }',
                                    description: "Indicates whether linkUp/linkDown traps should be generated for this interface. By default, this object should have the value enabled(1) for interfaces which do not operate on 'top' of any other interface (as defined in the ifStackTable), and disabled(2) otherwise."
                                },
                                ifHighSpeed: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.15',
                                    type: 'Gauge32',
                                    writable: false,
                                    syntax: 'Gauge32',
                                    description: "An estimate of the interface's current bandwidth in units of 1,000,000 bits per second. If this object reports a value of `n' then the speed of the interface is somewhere in the range of `n-500,000' to `n+499,999'. For interfaces which do not vary in bandwidth or for those where no accurate estimation can be made, this object should contain the nominal bandwidth. For a sub-layer which has no concept of bandwidth, this object should be zero."
                                },
                                ifPromiscuousMode: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.16',
                                    type: 'boolean',
                                    writable: true,
                                    syntax: 'TruthValue',
                                    description: "This object has a value of false(2) if this interface only accepts packets/frames that are addressed to this station. This object has a value of true(1) when the station accepts all packets/frames transmitted on the media. The value true(1) is only legal on certain types of media. If legal, setting this object to a value of true(1) may require the interface to be reset before becoming effective. The value of ifPromiscuousMode does not affect the reception of broadcast and multicast packets/frames by the interface."
                                },
                                ifConnectorPresent: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.17',
                                    type: 'boolean',
                                    writable: false,
                                    syntax: 'TruthValue',
                                    description: "This object has the value 'true(1)' if the interface sublayer has a physical connector and the value 'false(2)' otherwise."
                                },
                                ifAlias: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.18',
                                    type: 'string',
                                    writable: true,
                                    syntax: 'DisplayString (SIZE(0..64))',
                                    description: "This object is an 'alias' name for the interface as specified by a network manager, and provides a non-volatile 'handle' for the interface. On the first instantiation of an interface, the value of ifAlias associated with that interface is the zero-length string. As and when a value is written into an instance of ifAlias through a network management set operation, then the agent must retain the supplied value in the ifAlias instance associated with the same interface for as long as that interface remains instantiated, including across all re-initializations/reboots of the network management system, including those which result in a change of the interface's ifIndex value. An example of the value which a network manager might store in this object for a WAN interface is the (Telco's) circuit number/identifier of the interface. Some agents may support write-access only for interfaces having particular values of ifType. An agent which supports write access to this object is required to keep the value in non-volatile storage, but it may limit the length of new values depending on how much storage is already occupied by the current values for other interfaces."
                                },
                                ifCounterDiscontinuityTime: {
                                    OID: '1.3.6.1.2.1.31.1.1.1.19',
                                    type: 'TimeStamp',
                                    writable: false,
                                    syntax: 'TimeStamp',
                                    description: "The value of sysUpTime on the most recent occasion at which any one or more of this interface's counters suffered a discontinuity. The relevant counters are the specific instances associated with this interface of any Counter32 or Counter64 object contained in the ifTable or ifXTable. If no such discontinuities have occurred since the last re-initialization of the local management subsystem, then this object contains a zero value."
                                }
                            }
                        }
                    }
                },
                ifStackTable: {
                    OID: '1.3.6.1.2.1.31.1.2',
                    type: 'table',
                    description: "The table containing information on the relationships between the multiple sub-layers of network interfaces. In particular, it contains information on which sub-layers run 'on top of' which other sub-layers, where each sub-layer corresponds to a conceptual row in the ifTable. For example, when the sub-layer with ifIndex value x runs over the sub-layer with ifIndex value y, then this table contains: ifStackStatus.x.y=active For each ifIndex value, I, which identifies an active interface, there are always at least two instantiated rows in this table associated with I. For one of these rows, I is the value of ifStackHigherLayer; for the other, I is the value of ifStackLowerLayer. (If I is not involved in multiplexing, then these are the only two rows associated with I.) For example, two rows exist even for an interface which has no others stacked on top or below it: ifStackStatus.0.x=active ifStackStatus.x.0=active ",
                    children: {
                        ifStackEntry: {
                            OID: '1.3.6.1.2.1.31.1.2.1',
                            type: 'row',
                            rowIndex: 'ifStackHigherLayer, ifStackLowerLayer',
                            description: "Information on a particular relationship between two sub- layers, specifying that one sub-layer runs on 'top' of the other sub-layer. Each sub-layer corresponds to a conceptual row in the ifTable.",
                            children: {
                                ifStackHigherLayer: {
                                    OID: '1.3.6.1.2.1.31.1.2.1.1',
                                    type: 'number',
                                    writable: false,
                                    syntax: 'InterfaceIndexOrZero',
                                    description: "The value of ifIndex corresponding to the higher sub-layer of the relationship, i.e., the sub-layer which runs on 'top' of the sub-layer identified by the corresponding instance of ifStackLowerLayer. If there is no higher sub-layer (below the internetwork layer), then this object has the value 0."
                                },
                                ifStackLowerLayer: {
                                    OID: '1.3.6.1.2.1.31.1.2.1.2',
                                    type: 'number',
                                    writable: false,
                                    syntax: 'InterfaceIndexOrZero',
                                    description: "The value of ifIndex corresponding to the lower sub-layer of the relationship, i.e., the sub-layer which runs 'below' the sub-layer identified by the corresponding instance of ifStackHigherLayer. If there is no lower sub-layer, then this object has the value 0."
                                },
                                ifStackStatus: {
                                    OID: '1.3.6.1.2.1.31.1.2.1.3',
                                    type: 'RowStatus',
                                    writable: true,
                                    syntax: 'RowStatus',
                                    description: "The status of the relationship between two sub-layers. Changing the value of this object from 'active' to 'notInService' or 'destroy' will likely have consequences up and down the interface stack. Thus, write access to this object is likely to be inappropriate for some types of interfaces, and many implementations will choose not to support write-access for any type of interface."
                                }
                            }
                        }
                    }
                },
                ifRcvAddressTable: {
                    OID: '1.3.6.1.2.1.31.1.4',
                    type: 'table',
                    description: "This table contains an entry for each address (broadcast, multicast, or uni-cast) for which the system will receive packets/frames on a particular interface, except as follows: - for an interface operating in promiscuous mode, entries are only required for those addresses for which the system would receive frames were it not operating in promiscuous mode. - for 802.5 functional addresses, only one entry is required, for the address which has the functional address bit ANDed with the bit mask of all functional addresses for which the interface will accept frames. A system is normally able to use any unicast address which corresponds to an entry in this table as a source address.",
                    children: {
                        ifRcvAddressEntry: {
                            OID: '1.3.6.1.2.1.31.1.4.1',
                            type: 'row',
                            rowIndex: 'ifIndex, ifRcvAddressAddress',
                            description: "A list of objects identifying an address for which the system will accept packets/frames on the particular interface identified by the index value ifIndex.",
                            children: {
                                ifRcvAddressAddress: {
                                    OID: '1.3.6.1.2.1.31.1.4.1.1',
                                    type: 'PhysAddress',
                                    writable: false,
                                    syntax: 'PhysAddress',
                                    description: "An address for which the system will accept packets/frames on this entry's interface."
                                },
                                ifRcvAddressStatus: {
                                    OID: '1.3.6.1.2.1.31.1.4.1.2',
                                    type: 'RowStatus',
                                    writable: true,
                                    syntax: 'RowStatus',
                                    description: "This object is used to create and delete rows in the ifRcvAddressTable."
                                },
                                ifRcvAddressType: {
                                    OID: '1.3.6.1.2.1.31.1.4.1.3',
                                    type: 'enum',
                                    writable: true,
                                    enum: {
                                        1: 'other',
                                        2: 'volatile',
                                        3: 'nonVolatile'
                                    },
                                    syntax: 'INTEGER { other(1), volatile(2), nonVolatile(3) }',
                                    description: "This object has the value nonVolatile(3) for those entries in the table which are valid and will not be deleted by the next restart of the managed system. Entries having the value volatile(2) are valid and exist, but have not been saved, so that will not exist after the next restart of the managed system. Entries having the value other(1) are valid and exist but are not classified as to whether they will continue to exist after the next restart."
                                }
                            }
                        }
                    }
                },
                ifStackLastChange: {
                    OID: '1.3.6.1.2.1.31.1.6',
                    type: 'TimeTicks',
                    writable: false,
                    syntax: 'TimeTicks',
                    description: "The value of sysUpTime at the time of the last change of the (whole) interface stack. A change of the interface stack is defined to be any creation, deletion, or change in value of any instance of ifStackStatus. If the interface stack has been unchanged since the last re-initialization of the local network management subsystem, then this object contains a zero value."
                }
            }
        },
        interfaces: {
            OID: '1.3.6.1.2.1.2',
            type: 'group',
            description: 'The MIB-II Interfaces Group (Implicit description from context and MIB-II structure)',
            children: {
                ifNumber: {
                    OID: '1.3.6.1.2.1.2.1',
                    type: 'Integer32',
                    writable: false,
                    syntax: 'Integer32',
                    description: "The number of network interfaces (regardless of their current state) present on this system."
                },
                ifTable: {
                    OID: '1.3.6.1.2.1.2.2',
                    type: 'table',
                    description: "A list of interface entries. The number of entries is given by the value of ifNumber.",
                    children: {
                        ifEntry: {
                            OID: '1.3.6.1.2.1.2.2.1',
                            type: 'row',
                            rowIndex: 'ifIndex',
                            description: "An entry containing management information applicable to a particular interface.",
                            children: {
                                ifIndex: {
                                    OID: '1.3.6.1.2.1.2.2.1.1',
                                    type: 'number',
                                    writable: false,
                                    syntax: 'InterfaceIndex',
                                    description: "A unique value, greater than zero, for each interface. It is recommended that values are assigned contiguously starting from 1. The value for each interface sub-layer must remain constant at least from one re-initialization of the entity's network management system to the next re- initialization."
                                },
                                ifDescr: {
                                    OID: '1.3.6.1.2.1.2.2.1.2',
                                    type: 'string',
                                    writable: false,
                                    syntax: 'DisplayString (SIZE (0..255))',
                                    description: "A textual string containing information about the interface. This string should include the name of the manufacturer, the product name and the version of the interface hardware/software."
                                },
                                ifType: {
                                    OID: '1.3.6.1.2.1.2.2.1.3',
                                    type: 'IANAifType',
                                    writable: false,
                                    syntax: 'IANAifType',
                                    description: "The type of interface. Additional values for ifType are assigned by the Internet Assigned Numbers Authority (IANA), through updating the syntax of the IANAifType textual convention."
                                },
                                ifMtu: {
                                    OID: '1.3.6.1.2.1.2.2.1.4',
                                    type: 'Integer32',
                                    writable: false,
                                    syntax: 'Integer32',
                                    description: "The size of the largest packet which can be sent/received on the interface, specified in octets. For interfaces that are used for transmitting network datagrams, this is the size of the largest network datagram that can be sent on the interface."
                                },
                                ifSpeed: {
                                    OID: '1.3.6.1.2.1.2.2.1.5',
                                    type: 'Gauge32',
                                    writable: false,
                                    syntax: 'Gauge32',
                                    description: "An estimate of the interface's current bandwidth in bits per second. For interfaces which do not vary in bandwidth or for those where no accurate estimation can be made, this object should contain the nominal bandwidth. If the bandwidth of the interface is greater than the maximum value reportable by this object then this object should report its maximum value (4,294,967,295) and ifHighSpeed must be used to report the interace's speed. For a sub-layer which has no concept of bandwidth, this object should be zero."
                                },
                                ifPhysAddress: {
                                    OID: '1.3.6.1.2.1.2.2.1.6',
                                    type: 'PhysAddress',
                                    writable: false,
                                    syntax: 'PhysAddress',
                                    description: "The interface's address at its protocol sub-layer. For example, for an 802.x interface, this object normally contains a MAC address. The interface's media-specific MIB must define the bit and byte ordering and the format of the value of this object. For interfaces which do not have such an address (e.g., a serial line), this object should contain an octet string of zero length."
                                },
                                ifAdminStatus: {
                                    OID: '1.3.6.1.2.1.2.2.1.7',
                                    type: 'enum',
                                    writable: true,
                                    enum: {
                                        1: 'up',
                                        2: 'down',
                                        3: 'testing'
                                    },
                                    syntax: 'INTEGER { up(1), down(2), testing(3) }',
                                    description: "The desired state of the interface. The testing(3) state indicates that no operational packets can be passed. When a managed system initializes, all interfaces start with ifAdminStatus in the down(2) state. As a result of either explicit management action or per configuration information retained by the managed system, ifAdminStatus is then changed to either the up(1) or testing(3) states (or remains in the down(2) state)."
                                },
                                ifOperStatus: {
                                    OID: '1.3.6.1.2.1.2.2.1.8',
                                    type: 'enum',
                                    writable: false,
                                    enum: {
                                        1: 'up',
                                        2: 'down',
                                        3: 'testing',
                                        4: 'unknown',
                                        5: 'dormant',
                                        6: 'notPresent',
                                        7: 'lowerLayerDown'
                                    },
                                    syntax: 'INTEGER { up(1), down(2), testing(3), unknown(4), dormant(5), notPresent(6), lowerLayerDown(7) }',
                                    description: "The current operational state of the interface. The testing(3) state indicates that no operational packets can be passed. If ifAdminStatus is down(2) then ifOperStatus should be down(2). If ifAdminStatus is changed to up(1) then ifOperStatus should change to up(1) if the interface is ready to transmit and receive network traffic; it should change to dormant(5) if the interface is waiting for external actions (such as a serial line waiting for an incoming connection); it should remain in the down(2) state if and only if there is a fault that prevents it from going to the up(1) state; it should remain in the notPresent(6) state if the interface has missing (typically, hardware) components."
                                },
                                ifLastChange: {
                                    OID: '1.3.6.1.2.1.2.2.1.9',
                                    type: 'TimeTicks',
                                    writable: false,
                                    syntax: 'TimeTicks',
                                    description: "The value of sysUpTime at the time the interface entered its current operational state. If the current state was entered prior to the last re-initialization of the local network management subsystem, then this object contains a zero value."
                                },
                                ifInOctets: {
                                    OID: '1.3.6.1.2.1.2.2.1.10',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The total number of octets received on the interface, including framing characters. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifInUcastPkts: {
                                    OID: '1.3.6.1.2.1.2.2.1.11',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were not addressed to a multicast or broadcast address at this sub-layer. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifInNUcastPkts: {
                                    OID: '1.3.6.1.2.1.2.2.1.12',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The number of packets, delivered by this sub-layer to a higher (sub-)layer, which were addressed to a multicast or broadcast address at this sub-layer. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime. This object is deprecated in favour of ifInMulticastPkts and ifInBroadcastPkts."
                                },
                                ifInDiscards: {
                                    OID: '1.3.6.1.2.1.2.2.1.13',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The number of inbound packets which were chosen to be discarded even though no errors had been detected to prevent their being deliverable to a higher-layer protocol. One possible reason for discarding such a packet could be to free up buffer space. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifInErrors: {
                                    OID: '1.3.6.1.2.1.2.2.1.14',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "For packet-oriented interfaces, the number of inbound packets that contained errors preventing them from being deliverable to a higher-layer protocol. For character- oriented or fixed-length interfaces, the number of inbound transmission units that contained errors preventing them from being deliverable to a higher-layer protocol. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifInUnknownProtos: {
                                    OID: '1.3.6.1.2.1.2.2.1.15',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "For packet-oriented interfaces, the number of packets received via the interface which were discarded because of an unknown or unsupported protocol. For character-oriented or fixed-length interfaces that support protocol multiplexing the number of transmission units received via the interface which were discarded because of an unknown or unsupported protocol. For any interface that does not support protocol multiplexing, this counter will always be 0. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutOctets: {
                                    OID: '1.3.6.1.2.1.2.2.1.16',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The total number of octets transmitted out of the interface, including framing characters. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutUcastPkts: {
                                    OID: '1.3.6.1.2.1.2.2.1.17',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were not addressed to a multicast or broadcast address at this sub-layer, including those that were discarded or not sent. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutNUcastPkts: {
                                    OID: '1.3.6.1.2.1.2.2.1.18',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The total number of packets that higher-level protocols requested be transmitted, and which were addressed to a multicast or broadcast address at this sub-layer, including those that were discarded or not sent. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime. This object is deprecated in favour of ifOutMulticastPkts and ifOutBroadcastPkts."
                                },
                                ifOutDiscards: {
                                    OID: '1.3.6.1.2.1.2.2.1.19',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "The number of outbound packets which were chosen to be discarded even though no errors had been detected to prevent their being transmitted. One possible reason for discarding such a packet could be to free up buffer space. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutErrors: {
                                    OID: '1.3.6.1.2.1.2.2.1.20',
                                    type: 'Counter32',
                                    writable: false,
                                    syntax: 'Counter32',
                                    description: "For packet-oriented interfaces, the number of outbound packets that could not be transmitted because of errors. For character-oriented or fixed-length interfaces, the number of outbound transmission units that could not be transmitted because of errors. Discontinuities in the value of this counter can occur at re-initialization of the management system, and at other times as indicated by the value of ifCounterDiscontinuityTime."
                                },
                                ifOutQLen: {
                                    OID: '1.3.6.1.2.1.2.2.1.21',
                                    type: 'Gauge32',
                                    writable: false,
                                    syntax: 'Gauge32',
                                    description: "The length of the output packet queue (in packets)."
                                },
                                ifSpecific: {
                                    OID: '1.3.6.1.2.1.2.2.1.22',
                                    type: 'OBJECT IDENTIFIER',
                                    writable: false,
                                    syntax: 'OBJECT IDENTIFIER',
                                    description: "A reference to MIB definitions specific to the particular media being used to realize the interface. It is recommended that this value point to an instance of a MIB object in the media-specific MIB, i.e., that this object have the semantics associated with the InstancePointer textual convention defined in RFC 2579. In fact, it is recommended that the media-specific MIB specify what value ifSpecific should/can take for values of ifType. If no MIB definitions specific to the particular media are available, the value should be set to the OBJECT IDENTIFIER { 0 0 }."
                                }
                            }
                        }
                    }
                }
            }
        },
        ifConformance: {
            OID: '1.3.6.1.2.1.31.2',
            type: 'group',
            description: 'Conformance information for IF-MIB. (Implicit description)',
            children: {
                ifGroups: {
                    OID: '1.3.6.1.2.1.31.2.1',
                    type: 'group',
                    description: 'Groups for IF-MIB conformance. (Implicit description)',
                    children: {}
                },
                ifCompliances: {
                    OID: '1.3.6.1.2.1.31.2.2',
                    type: 'group',
                    description: 'Compliance statements for IF-MIB. (Implicit description)',
                    children: {
                        ifCompliance3: {
                            OID: '1.3.6.1.2.1.31.2.2.3',
                            type: 'MODULE-COMPLIANCE',
                            description: "The compliance statement for SNMP entities which have network interfaces.",
                            children: {}
                        }
                    }
                }
            }
        }
    }
};