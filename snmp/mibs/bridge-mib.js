mibs['BRIDGE-MIB'] = {
    OID: '1.3.6.1.2.1.17',
    type: 'MIB',
    description: "The MIB module for IEEE 802.1D bridges. (Implicit description from context)",
    children: {
        dot1dBridge: {
            OID: '1.3.6.1.2.1.17',
            type: 'group',
            description: 'The root of the Bridge MIB object identifier tree.',
            children: {
                dot1dBase: {
                    OID: '1.3.6.1.2.1.17.1',
                    type: 'group',
                    description: 'The dot1dBase group contains objects for basic bridge information.',
                    children: {
                        dot1dBaseBridgeAddress: {
                            OID: '1.3.6.1.2.1.17.1.1',
                            type: 'MacAddress',
                            writable: false,
                            syntax: 'MacAddress',
                            description: "The MAC address used by this bridge when it must be referred to in a unique fashion. It is recommended that this be the numerically smallest MAC address of all ports that belong to this bridge. However it is only required to be unique. When concatenated with dot1dStpPriority a unique BridgeIdentifier is formed which is used in the Spanning Tree Protocol."
                        },
                        dot1dBaseNumPorts: {
                            OID: '1.3.6.1.2.1.17.1.2',
                            type: 'Integer32',
                            writable: false,
                            syntax: 'INTEGER',
                            description: "The number of ports controlled by this bridging entity."
                        },
                        dot1dBaseType: {
                            OID: '1.3.6.1.2.1.17.1.3',
                            type: 'enum',
                            writable: false,
                            enum: {
                                1: 'unknown',
                                2: 'transparent-only',
                                3: 'sourceroute-only',
                                4: 'srt'
                            },
                            syntax: 'INTEGER { unknown(1), transparent-only(2), sourceroute-only(3), srt(4) }',
                            description: "Indicates what type of bridging this bridge can perform. If a bridge is actually performing a certain type of bridging this will be indicated by entries in the port table for the given type."
                        },
                        dot1dBasePortTable: {
                            OID: '1.3.6.1.2.1.17.1.4',
                            type: 'table',
                            description: "A table that contains generic information about every port that is associated with this bridge. Transparent, source-route, and srt ports are included.",
                            children: {
                                dot1dBasePortEntry: {
                                    OID: '1.3.6.1.2.1.17.1.4.1',
                                    type: 'row',
                                    rowIndex: 'dot1dBasePort',
                                    description: "A list of information for each port of the bridge.",
                                    children: {
                                        dot1dBasePort: {
                                            OID: '1.3.6.1.2.1.17.1.4.1.1',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (1..65535)',
                                            description: "The port number of the port for which this entry contains bridge management information."
                                        },
                                        dot1dBasePortIfIndex: {
                                            OID: '1.3.6.1.2.1.17.1.4.1.2',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER',
                                            description: "The value of the instance of the ifIndex object, defined in MIB-II, for the interface corresponding to this port."
                                        },
                                        dot1dBasePortCircuit: {
                                            OID: '1.3.6.1.2.1.17.1.4.1.3',
                                            type: 'OBJECT IDENTIFIER',
                                            writable: false,
                                            syntax: 'OBJECT IDENTIFIER',
                                            description: "For a port which (potentially) has the same value of dot1dBasePortIfIndex as another port on the same bridge, this object contains the name of an object instance unique to this port. For example, in the case where multiple ports correspond one-to-one with multiple X.25 virtual circuits, this value might identify an (e.g., the first) object instance associated with the X.25 virtual circuit corresponding to this port. For a port which has a unique value of dot1dBasePortIfIndex, this object can have the value { 0 0 }."
                                        },
                                        dot1dBasePortDelayExceededDiscards: {
                                            OID: '1.3.6.1.2.1.17.1.4.1.4',
                                            type: 'Counter',
                                            writable: false,
                                            syntax: 'Counter',
                                            description: "The number of frames discarded by this port due to excessive transit delay through the bridge. It is incremented by both transparent and source route bridges."
                                        },
                                        dot1dBasePortMtuExceededDiscards: {
                                            OID: '1.3.6.1.2.1.17.1.4.1.5',
                                            type: 'Counter',
                                            writable: false,
                                            syntax: 'Counter',
                                            description: "The number of frames discarded by this port due to an excessive size. It is incremented by both transparent and source route bridges."
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                dot1dStp: {
                    OID: '1.3.6.1.2.1.17.2',
                    type: 'group',
                    description: 'The dot1dStp group contains objects for the Spanning Tree Protocol. Implementation of the dot1dStp group is optional. It is implemented by those bridges that support the Spanning Tree Protocol.',
                    children: {
                        dot1dStpProtocolSpecification: {
                            OID: '1.3.6.1.2.1.17.2.1',
                            type: 'enum',
                            writable: false,
                            enum: {
                                1: 'unknown',
                                2: 'decLb100',
                                3: 'ieee8021d'
                            },
                            syntax: 'INTEGER { unknown(1), decLb100(2), ieee8021d(3) }',
                            description: "An indication of what version of the Spanning Tree Protocol is being run. The value 'decLb100(2)' indicates the DEC LANbridge 100 Spanning Tree protocol. IEEE 802.1d implementations will return 'ieee8021d(3)'. If future versions of the IEEE Spanning Tree Protocol are released that are incompatible with the current version a new value will be defined."
                        },
                        dot1dStpPriority: {
                            OID: '1.3.6.1.2.1.17.2.2',
                            type: 'Integer32',
                            writable: true,
                            syntax: 'INTEGER (0..65535)',
                            description: "The value of the write-able portion of the Bridge ID, i.e., the first two octets of the (8 octet long) Bridge ID. The other (last) 6 octets of the Bridge ID are given by the value of dot1dBaseBridgeAddress."
                        },
                        dot1dStpTimeSinceTopologyChange: {
                            OID: '1.3.6.1.2.1.17.2.3',
                            type: 'TimeTicks',
                            writable: false,
                            syntax: 'TimeTicks',
                            description: "The time (in hundredths of a second) since the last time a topology change was detected by the bridge entity."
                        },
                        dot1dStpTopChanges: {
                            OID: '1.3.6.1.2.1.17.2.4',
                            type: 'Counter',
                            writable: false,
                            syntax: 'Counter',
                            description: "The total number of topology changes detected by this bridge since the management entity was last reset or initialized."
                        },
                        dot1dStpDesignatedRoot: {
                            OID: '1.3.6.1.2.1.17.2.5',
                            type: 'BridgeId',
                            writable: false,
                            syntax: 'BridgeId',
                            description: "The bridge identifier of the root of the spanning tree as determined by the Spanning Tree Protocol as executed by this node. This value is used as the Root Identifier parameter in all Configuration Bridge PDUs originated by this node."
                        },
                        dot1dStpRootCost: {
                            OID: '1.3.6.1.2.1.17.2.6',
                            type: 'Integer32',
                            writable: false,
                            syntax: 'INTEGER',
                            description: "The cost of the path to the root as seen from this bridge."
                        },
                        dot1dStpRootPort: {
                            OID: '1.3.6.1.2.1.17.2.7',
                            type: 'Integer32',
                            writable: false,
                            syntax: 'INTEGER',
                            description: "The port number of the port which offers the lowest cost path from this bridge to the root bridge."
                        },
                        dot1dStpMaxAge: {
                            OID: '1.3.6.1.2.1.17.2.8',
                            type: 'Timeout',
                            writable: false,
                            syntax: 'Timeout',
                            description: "The maximum age of Spanning Tree Protocol information learned from the network on any port before it is discarded, in units of hundredths of a second. This is the actual value that this bridge is currently using."
                        },
                        dot1dStpHelloTime: {
                            OID: '1.3.6.1.2.1.17.2.9',
                            type: 'Timeout',
                            writable: false,
                            syntax: 'Timeout',
                            description: "The amount of time between the transmission of Configuration bridge PDUs by this node on any port when it is the root of the spanning tree or trying to become so, in units of hundredths of a second. This is the actual value that this bridge is currently using."
                        },
                        dot1dStpHoldTime: {
                            OID: '1.3.6.1.2.1.17.2.10',
                            type: 'Integer32',
                            writable: false,
                            syntax: 'INTEGER',
                            description: "This time value determines the interval length during which no more than two Configuration bridge PDUs shall be transmitted by this node, in units of hundredths of a second."
                        },
                        dot1dStpForwardDelay: {
                            OID: '1.3.6.1.2.1.17.2.11',
                            type: 'Timeout',
                            writable: false,
                            syntax: 'Timeout',
                            description: "This time value, measured in units of hundredths of a second, controls how fast a port changes its spanning state when moving towards the Forwarding state. The value determines how long the port stays in each of the Listening and Learning states, which precede the Forwarding state. This value is also used, when a topology change has been detected and is underway, to age all dynamic entries in the Forwarding Database. [Note that this value is the one that this bridge is currently using, in contrast to dot1dStpBridgeForwardDelay which is the value that this bridge and all others would start using if/when this bridge were to become the root.]"
                        },
                        dot1dStpBridgeMaxAge: {
                            OID: '1.3.6.1.2.1.17.2.12',
                            type: 'Timeout',
                            writable: true,
                            syntax: 'Timeout (600..4000)',
                            description: "The value that all bridges use for MaxAge when this bridge is acting as the root. Note that 802.1D-1990 specifies that the range for this parameter is related to the value of dot1dStpBridgeHelloTime. The granularity of this timer is specified by 802.1D-1990 to be 1 second. An agent may return a badValue error if a set is attempted to a value which is not a whole number of seconds."
                        },
                        dot1dStpBridgeHelloTime: {
                            OID: '1.3.6.1.2.1.17.2.13',
                            type: 'Timeout',
                            writable: true,
                            syntax: 'Timeout (100..1000)',
                            description: "The value that all bridges use for HelloTime when this bridge is acting as the root. The granularity of this timer is specified by 802.1D-1990 to be 1 second. An agent may return a badValue error if a set is attempted to a value which is not a whole number of seconds."
                        },
                        dot1dStpBridgeForwardDelay: {
                            OID: '1.3.6.1.2.1.17.2.14',
                            type: 'Timeout',
                            writable: true,
                            syntax: 'Timeout (400..3000)',
                            description: "The value that all bridges use for ForwardDelay when this bridge is acting as the root. Note that 802.1D-1990 specifies that the range for this parameter is related to the value of dot1dStpBridgeMaxAge. The granularity of this timer is specified by 802.1D-1990 to be 1 second. An agent may return a badValue error if a set is attempted to a value which is not a whole number of seconds."
                        },
                        dot1dStpPortTable: {
                            OID: '1.3.6.1.2.1.17.2.15',
                            type: 'table',
                            description: "A table that contains port-specific information for the Spanning Tree Protocol.",
                            children: {
                                dot1dStpPortEntry: {
                                    OID: '1.3.6.1.2.1.17.2.15.1',
                                    type: 'row',
                                    rowIndex: 'dot1dStpPort',
                                    description: "A list of information maintained by every port about the Spanning Tree Protocol state for that port.",
                                    children: {
                                        dot1dStpPort: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.1',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (1..65535)',
                                            description: "The port number of the port for which this entry contains Spanning Tree Protocol management information."
                                        },
                                        dot1dStpPortPriority: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.2',
                                            type: 'Integer32',
                                            writable: true,
                                            syntax: 'INTEGER (0..255)',
                                            description: "The value of the priority field which is contained in the first (in network byte order) octet of the (2 octet long) Port ID. The other octet of the Port ID is given by the value of dot1dStpPort."
                                        },
                                        dot1dStpPortState: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.3',
                                            type: 'enum',
                                            writable: false,
                                            enum: {
                                                1: 'disabled',
                                                2: 'blocking',
                                                3: 'listening',
                                                4: 'learning',
                                                5: 'forwarding',
                                                6: 'broken'
                                            },
                                            syntax: 'INTEGER { disabled(1), blocking(2), listening(3), learning(4), forwarding(5), broken(6) }',
                                            description: "The port's current state as defined by application of the Spanning Tree Protocol. This state controls what action a port takes on reception of a frame. If the bridge has detected a port that is malfunctioning it will place that port into the broken(6) state. For ports which are disabled (see dot1dStpPortEnable), this object will have a value of disabled(1)."
                                        },
                                        dot1dStpPortEnable: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.4',
                                            type: 'enum',
                                            writable: true,
                                            enum: {
                                                1: 'enabled',
                                                2: 'disabled'
                                            },
                                            syntax: 'INTEGER { enabled(1), disabled(2) }',
                                            description: "The enabled/disabled status of the port."
                                        },
                                        dot1dStpPortPathCost: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.5',
                                            type: 'Integer32',
                                            writable: true,
                                            syntax: 'INTEGER (1..65535)',
                                            description: "The contribution of this port to the path cost of paths towards the spanning tree root which include this port. 802.1D-1990 recommends that the default value of this parameter be in inverse proportion to the speed of the attached LAN."
                                        },
                                        dot1dStpPortDesignatedRoot: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.6',
                                            type: 'BridgeId',
                                            writable: false,
                                            syntax: 'BridgeId',
                                            description: "The unique Bridge Identifier of the Bridge recorded as the Root in the Configuration BPDUs transmitted by the Designated Bridge for the segment to which the port is attached."
                                        },
                                        dot1dStpPortDesignatedCost: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.7',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER',
                                            description: "The path cost of the Designated Port of the segment connected to this port. This value is compared to the Root Path Cost field in received bridge PDUs."
                                        },
                                        dot1dStpPortDesignatedBridge: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.8',
                                            type: 'BridgeId',
                                            writable: false,
                                            syntax: 'BridgeId',
                                            description: "The Bridge Identifier of the bridge which this port considers to be the Designated Bridge for this port's segment."
                                        },
                                        dot1dStpPortDesignatedPort: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.9',
                                            type: 'OCTET STRING',
                                            writable: false,
                                            syntax: 'OCTET STRING (SIZE (2))',
                                            description: "The Port Identifier of the port on the Designated Bridge for this port's segment."
                                        },
                                        dot1dStpPortForwardTransitions: {
                                            OID: '1.3.6.1.2.1.17.2.15.1.10',
                                            type: 'Counter',
                                            writable: false,
                                            syntax: 'Counter',
                                            description: "The number of times this port has transitioned from the Learning state to the Forwarding state."
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                dot1dSr: {
                    OID: '1.3.6.1.2.1.17.3',
                    type: 'group',
                    description: 'This group is separately documented.',
                    children: {}
                },
                dot1dTp: {
                    OID: '1.3.6.1.2.1.17.4',
                    type: 'group',
                    description: 'The dot1dTp group contains objects for transparent bridging mode. Implementation of the dot1dTp group is optional. It is implemented by those bridges that support the transparent bridging mode. A transparent or SRT bridge will implement this group.',
                    children: {
                        dot1dTpLearnedEntryDiscards: {
                            OID: '1.3.6.1.2.1.17.4.1',
                            type: 'Counter',
                            writable: false,
                            syntax: 'Counter',
                            description: "The total number of Forwarding Database entries, which have been or would have been learnt, but have been discarded due to a lack of space to store them in the Forwarding Database. If this counter is increasing, it indicates that the Forwarding Database is regularly becoming full (a condition which has unpleasant performance effects on the subnetwork). If this counter has a significant value but is not presently increasing, it indicates that the problem has been occurring but is not persistent."
                        },
                        dot1dTpAgingTime: {
                            OID: '1.3.6.1.2.1.17.4.2',
                            type: 'Integer32',
                            writable: true,
                            syntax: 'INTEGER (10..1000000)',
                            description: "The timeout period in seconds for aging out dynamically learned forwarding information. 802.1D-1990 recommends a default of 300 seconds."
                        },
                        dot1dTpFdbTable: {
                            OID: '1.3.6.1.2.1.17.4.3',
                            type: 'table',
                            description: "A table that contains information about unicast entries for which the bridge has forwarding and/or filtering information. This information is used by the transparent bridging function in determining how to propagate a received frame.",
                            children: {
                                dot1dTpFdbEntry: {
                                    OID: '1.3.6.1.2.1.17.4.3.1',
                                    type: 'row',
                                    rowIndex: 'dot1dTpFdbAddress',
                                    description: "Information about a specific unicast MAC address for which the bridge has some forwarding and/or filtering information.",
                                    children: {
                                        dot1dTpFdbAddress: {
                                            OID: '1.3.6.1.2.1.17.4.3.1.1',
                                            type: 'MacAddress',
                                            writable: false,
                                            syntax: 'MacAddress',
                                            description: "A unicast MAC address for which the bridge has forwarding and/or filtering information."
                                        },
                                        dot1dTpFdbPort: {
                                            OID: '1.3.6.1.2.1.17.4.3.1.2',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER',
                                            description: "Either the value '0', or the port number of the port on which a frame having a source address equal to the value of the corresponding instance of dot1dTpFdbAddress has been seen. A value of '0' indicates that the port number has not been learned but that the bridge does have some forwarding/filtering information about this address (e.g. in the dot1dStaticTable). Implementors are encouraged to assign the port value to this object whenever it is learned even for addresses for which the corresponding value of dot1dTpFdbStatus is not learned(3)."
                                        },
                                        dot1dTpFdbStatus: {
                                            OID: '1.3.6.1.2.1.17.4.3.1.3',
                                            type: 'enum',
                                            writable: false,
                                            enum: {
                                                1: 'other',
                                                2: 'invalid',
                                                3: 'learned',
                                                4: 'self',
                                                5: 'mgmt'
                                            },
                                            syntax: 'INTEGER { other(1), invalid(2), learned(3), self(4), mgmt(5) }',
                                            description: "The status of this entry. The meanings of the values are: other(1) : none of the following. This would include the case where some other MIB object (not the corresponding instance of dot1dTpFdbPort, nor an entry in the dot1dStaticTable) is being used to determine if and how frames addressed to the value of the corresponding instance of dot1dTpFdbAddress are being forwarded. invalid(2) : this entry is not longer valid (e.g., it was learned but has since aged-out), but has not yet been flushed from the table. learned(3) : the value of the corresponding instance of dot1dTpFdbPort was learned, and is being used. self(4) : the value of the corresponding instance of dot1dTpFdbAddress represents one of the bridge's addresses. The corresponding instance of dot1dTpFdbPort indicates which of the bridge's ports has this address. mgmt(5) : the value of the corresponding instance of dot1dTpFdbAddress is also the value of an existing instance of dot1dStaticAddress."
                                        }
                                    }
                                }
                            }
                        },
                        dot1dTpPortTable: {
                            OID: '1.3.6.1.2.1.17.4.4',
                            type: 'table',
                            description: "A table that contains information about every port that is associated with this transparent bridge.",
                            children: {
                                dot1dTpPortEntry: {
                                    OID: '1.3.6.1.2.1.17.4.4.1',
                                    type: 'row',
                                    rowIndex: 'dot1dTpPort',
                                    description: "A list of information for each port of a transparent bridge.",
                                    children: {
                                        dot1dTpPort: {
                                            OID: '1.3.6.1.2.1.17.4.4.1.1',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (1..65535)',
                                            description: "The port number of the port for which this entry contains Transparent bridging management information."
                                        },
                                        dot1dTpPortMaxInfo: {
                                            OID: '1.3.6.1.2.1.17.4.4.1.2',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER',
                                            description: "The maximum size of the INFO (non-MAC) field that this port will receive or transmit."
                                        },
                                        dot1dTpPortInFrames: {
                                            OID: '1.3.6.1.2.1.17.4.4.1.3',
                                            type: 'Counter',
                                            writable: false,
                                            syntax: 'Counter',
                                            description: "The number of frames that have been received by this port from its segment. Note that a frame received on the interface corresponding to this port is only counted by this object if and only if it is for a protocol being processed by the local bridging function, including bridge management frames."
                                        },
                                        dot1dTpPortOutFrames: {
                                            OID: '1.3.6.1.2.1.17.4.4.1.4',
                                            type: 'Counter',
                                            writable: false,
                                            syntax: 'Counter',
                                            description: "The number of frames that have been transmitted by this port to its segment. Note that a frame transmitted on the interface corresponding to this port is only counted by this object if and only if it is for a protocol being processed by the local bridging function, including bridge management frames."
                                        },
                                        dot1dTpPortInDiscards: {
                                            OID: '1.3.6.1.2.1.17.4.4.1.5',
                                            type: 'Counter',
                                            writable: false,
                                            syntax: 'Counter',
                                            description: "Count of valid frames received which were discarded (i.e., filtered) by the Forwarding Process."
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                dot1dStatic: {
                    OID: '1.3.6.1.2.1.17.5',
                    type: 'group',
                    description: 'The dot1dStatic group contains objects for the Static (Destination-Address Filtering) Database. Implementation of this group is optional.',
                    children: {
                        dot1dStaticTable: {
                            OID: '1.3.6.1.2.1.17.5.1',
                            type: 'table',
                            description: "A table containing filtering information configured into the bridge by (local or network) management specifying the set of ports to which frames received from specific ports and containing specific destination addresses are allowed to be forwarded. The value of zero in this table as the port number from which frames with a specific destination address are received, is used to specify all ports for which there is no specific entry in this table for that particular destination address. Entries are valid for unicast and for group/broadcast addresses.",
                            children: {
                                dot1dStaticEntry: {
                                    OID: '1.3.6.1.2.1.17.5.1.1',
                                    type: 'row',
                                    rowIndex: 'dot1dStaticAddress, dot1dStaticReceivePort',
                                    description: "Filtering information configured into the bridge by (local or network) management specifying the set of ports to which frames received from a specific port and containing a specific destination address are allowed to be forwarded.",
                                    children: {
                                        dot1dStaticAddress: {
                                            OID: '1.3.6.1.2.1.17.5.1.1.1',
                                            type: 'MacAddress',
                                            writable: true,
                                            syntax: 'MacAddress',
                                            description: "The destination MAC address in a frame to which this entry's filtering information applies. This object can take the value of a unicast address, a group address or the broadcast address."
                                        },
                                        dot1dStaticReceivePort: {
                                            OID: '1.3.6.1.2.1.17.5.1.1.2',
                                            type: 'Integer32',
                                            writable: true,
                                            syntax: 'INTEGER',
                                            description: "Either the value '0', or the port number of the port from which a frame must be received in order for this entry's filtering information to apply. A value of zero indicates that this entry applies on all ports of the bridge for which there is no other applicable entry."
                                        },
                                        dot1dStaticAllowedToGoTo: {
                                            OID: '1.3.6.1.2.1.17.5.1.1.3',
                                            type: 'OCTET STRING',
                                            writable: true,
                                            syntax: 'OCTET STRING',
                                            description: "The set of ports to which frames received from a specific port and destined for a specific MAC address, are allowed to be forwarded. Each octet within the value of this object specifies a set of eight ports, with the first octet specifying ports 1 through 8, the second octet specifying ports 9 through 16, etc. Within each octet, the most significant bit represents the lowest numbered port, and the least significant bit represents the highest numbered port. Thus, each port of the bridge is represented by a single bit within the value of this object. If that bit has a value of '1' then that port is included in the set of ports; the port is not included if its bit has a value of '0'. (Note that the setting of the bit corresponding to the port from which a frame is received is irrelevant.) The default value of this object is a string of ones of appropriate length."
                                        },
                                        dot1dStaticStatus: {
                                            OID: '1.3.6.1.2.1.17.5.1.1.4',
                                            type: 'enum',
                                            writable: true,
                                            enum: {
                                                1: 'other',
                                                2: 'invalid',
                                                3: 'permanent',
                                                4: 'deleteOnReset',
                                                5: 'deleteOnTimeout'
                                            },
                                            syntax: 'INTEGER { other(1), invalid(2), permanent(3), deleteOnReset(4), deleteOnTimeout(5) }',
                                            description: "This object indicates the status of this entry. The default value is permanent(3). other(1) - this entry is currently in use but the conditions under which it will remain so are different from each of the following values. invalid(2) - writing this value to the object removes the corresponding entry. permanent(3) - this entry is currently in use and will remain so after the next reset of the bridge. deleteOnReset(4) - this entry is currently in use and will remain so until the next reset of the bridge. deleteOnTimeout(5) - this entry is currently in use and will remain so until it is aged out."
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                newRoot: {
                    OID: '1.3.6.1.2.1.17.0.1', // OID from TRAP-TYPE ::= 1 under ENTERPRISE dot1dBridge
                    type: 'TRAP-TYPE',
                    description: "The newRoot trap indicates that the sending agent has become the new root of the Spanning Tree; the trap is sent by a bridge soon after its election as the new root, e.g., upon expiration of the Topology Change Timer immediately subsequent to its election. Implementation of this trap is optional."
                },
                topologyChange: {
                    OID: '1.3.6.1.2.1.17.0.2', // OID from TRAP-TYPE ::= 2 under ENTERPRISE dot1dBridge
                    type: 'TRAP-TYPE',
                    description: "A topologyChange trap is sent by a bridge when any of its configured ports transitions from the Learning state to the Forwarding state, or from the Forwarding state to the Blocking state. The trap is not sent if a newRoot trap is sent for the same transition. Implementation of this trap is optional."
                }
            }
        }
    }
};