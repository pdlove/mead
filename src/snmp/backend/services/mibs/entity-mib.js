const mibs = {};

mibs['ENTITY-MIB'] = {
    OID: '1.3.6.1.2.1.47',
    type: 'MIB',
    [cite_start]description: "The MIB module for representing multiple logical entities supported by a single SNMP agent. [cite: 2]",
    children: {
        entityMIBObjects: {
            OID: '1.3.6.1.2.1.47.1',
            type: 'group',
            [cite_start]description: 'Top-level object identifier for Entity MIB objects. [cite: 5]',
            children: {
                entityPhysical: {
                    OID: '1.3.6.1.2.1.47.1.1',
                    type: 'group',
                    [cite_start]description: 'The physical entity group. [cite: 5]',
                    children: {
                        entPhysicalTable: {
                            OID: '1.3.6.1.2.1.47.1.1.1',
                            type: 'table',
                            [cite_start]description: "This table contains one row per physical entity. There is always at least one row for an 'overall' physical entity. [cite: 24, 25]",
                            children: {
                                entPhysicalEntry: {
                                    OID: '1.3.6.1.2.1.47.1.1.1.1',
                                    type: 'row',
                                    rowIndex: 'entPhysicalIndex',
                                    description: "Information about a particular physical entity. [cite_start]Each entry provides objects (entPhysicalDescr, entPhysicalVendorType, and entPhysicalClass) to help an NMS identify and characterize the entry, and objects (entPhysicalContainedIn and entPhysicalParentRelPos) to help an NMS relate the particular entry to other entries in this table. [cite: 26]",
                                    children: {
                                        entPhysicalIndex: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.1',
                                            type: 'Integer32', // Mapped from PhysicalIndex TEXTUAL-CONVENTION
                                            writable: false,
                                            syntax: 'INTEGER (1..2147483647)', // From PhysicalIndex
                                            [cite_start]description: "The index for this entry. [cite: 27]"
                                        },
                                        entPhysicalDescr: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.2',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "A textual description of physical entity. [cite_start]This object should contain a string which identifies the manufacturer's name for the physical entity, and should be set to a distinct value for each version or model of the physical entity. [cite: 27, 28]"
                                        },
                                        entPhysicalVendorType: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.3',
                                            type: 'AutonomousType',
                                            writable: false,
                                            syntax: 'AutonomousType',
                                            description: "An indication of the vendor-specific hardware type of the physical entity. Note that this is different from the definition of MIB-II's sysObjectID. An agent should set this object to a enterprise-specific registration identifier value indicating the specific equipment type in detail. The associated instance of entPhysicalClass is used to indicate the general type of hardware device. [cite_start]If no vendor-specific registration identifier exists for this physical entity, or the value is unknown by this agent, then the value { 0 0 } is returned. [cite: 29, 30, 31, 32, 33]"
                                        },
                                        entPhysicalContainedIn: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.4',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (0..2147483647)',
                                            description: "The value of entPhysicalIndex for the physical entity which 'contains' this physical entity. A value of zero indicates this physical entity is not contained in any other physical entity. Note that the set of 'containment' relationships define a strict hierarchy; that is, recursion is not allowed. [cite_start]In the event a physical entity is contained by more than one physical entity (e.g., double-wide modules), this object should identify the containing entity with the lowest value of entPhysicalIndex. [cite: 34, 35, 36]"
                                        },
                                        entPhysicalClass: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.5',
                                            type: 'enum',
                                            writable: false,
                                            enum: {
                                                1: 'other',
                                                2: 'unknown',
                                                3: 'chassis',
                                                4: 'backplane',
                                                5: 'container',
                                                6: 'powerSupply',
                                                7: 'fan',
                                                8: 'sensor',
                                                9: 'module',
                                                10: 'port',
                                                11: 'stack'
                                            },
                                            syntax: 'PhysicalClass', // Original TEXTUAL-CONVENTION name
                                            description: "An indication of the general hardware type of the physical entity. An agent should set this object to the standard enumeration value which most accurately indicates the general class of the physical entity, or the primary class if there is more than one. If no appropriate standard registration identifier exists for this physical entity, then the value 'other(1)' is returned. [cite_start]If the value is unknown by this agent, then the value 'unknown(2)' is returned. [cite: 37, 38, 39]"
                                        },
                                        entPhysicalParentRelPos: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.6',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (-1..2147483647)',
                                            description: "An indication of the relative position of this 'child' component among all its 'sibling' components. Sibling components are defined as entPhysicalEntries which share the same instance values of each of the entPhysicalContainedIn and entPhysicalClass objects. An NMS can use this object to identify the relative ordering for all sibling components of a particular parent (identified by the entPhysicalContainedIn instance in each sibling entry). This value should match any external labeling of the physical component if possible. For example, for a container (e.g., card slot) labeled as 'slot #3', entPhysicalParentRelPos should have the value '3'. Note that the entPhysicalEntry for the module plugged in slot 3 should have an entPhysicalParentRelPos value of '1'. If the physical position of this component does not match any external numbering or clearly visible ordering, then user documentation or other external reference material should be used to determine the parent-relative position. If this is not possible, then the the agent should assign a consistent (but possibly arbitrary) ordering to a given set of 'sibling' components, perhaps based on internal representation of the components. If the agent cannot determine the parent-relative position for some reason, or if the associated value of entPhysicalContainedIn is '0', then the value '-1' is returned. Otherwise a non-negative integer is returned, indicating the parent-relative position of this physical entity. Parent-relative ordering normally starts from '1' and continues to 'N', where 'N' represents the highest positioned child entity. However, if the physical entities (e.g., slots) are labeled from a starting position of zero, then the first sibling should be associated with a entPhysicalParentRelPos value of '0'. Note that this ordering may be sparse or dense, depending on agent implementation. The actual values returned are not globally meaningful, as each 'parent' component may use different numbering algorithms. The ordering is only meaningful among siblings of the same parent component. [cite_start]The agent should retain parent-relative position values across reboots, either through algorithmic assignment or use of non-volatile storage. [cite: 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54]"
                                        },
                                        entPhysicalName: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.7',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The textual name of the physical entity. The value of this object should be the name of the component as assigned by the local device and should be suitable for use in commands entered at the device's `console'. This might be a text name, such as `console' or a simple component number (e.g., port or module number), such as `1', depending on the physical component naming syntax of the device. If there is no local name, or this object is otherwise not applicable, then this object contains a zero-length string. [cite_start]Note that the value of entPhysicalName for two physical entities will be the same in the event that the console interface does not distinguish between them, e.g., slot-1 and the card in slot-1. [cite: 55, 56, 57, 58]"
                                        },
                                        entPhysicalHardwareRev: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.8',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The vendor-specific hardware revision string for the physical entity. The preferred value is the hardware revision identifier actually printed on the component itself (if present). Note that if revision information is stored internally in a non-printable (e.g., binary) format, then the agent must convert such information to a printable format, in an implementation-specific manner. [cite_start]If no specific hardware revision string is associated with the physical component, or this information is unknown to the agent, then this object will contain a zero-length string. [cite: 59, 60, 61]"
                                        },
                                        entPhysicalFirmwareRev: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.9',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The vendor-specific firmware revision string for the physical entity. Note that if revision information is stored internally in a non-printable (e.g., binary) format, then the agent must convert such information to a printable format, in an implementation-specific manner. [cite_start]If no specific firmware programs are associated with the physical component, or this information is unknown to the agent, then this object will contain a zero-length string. [cite: 62, 63]"
                                        },
                                        entPhysicalSoftwareRev: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.10',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The vendor-specific software revision string for the physical entity. Note that if revision information is stored internally in a non-printable (e.g., binary) format, then the agent must convert such information to a printable format, in an implementation-specific manner. [cite_start]If no specific software programs are associated with the physical component, or this information is unknown to the agent, then this object will contain a zero-length string. [cite: 64, 65]"
                                        },
                                        entPhysicalSerialNum: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.11',
                                            type: 'SnmpAdminString',
                                            writable: true,
                                            syntax: 'SnmpAdminString (SIZE (0..32))',
                                            description: "The vendor-specific serial number string for the physical entity. The preferred value is the serial number string actually printed on the component itself (if present). On the first instantiation of an physical entity, the value of entPhysicalSerialNum associated with that entity is set to the correct vendor-assigned serial number, if this information is available to the agent. If a serial number is unknown or non-existent, the entPhysicalSerialNum will be set to a zero-length string instead. Note that implementations which can correctly identify the serial numbers of all installed physical entities do not need to provide write access to the entPhysicalSerialNum object. Agents which cannot provide non-volatile storage for the entPhysicalSerialNum strings are not required to implement write access for this object. Not every physical component will have a serial number, or even need one. Physical entities for which the associated value of the entPhysicalIsFRU object is equal to 'false(2)' (e.g., the repeater ports within a repeater module), do not need their own unique serial number. An agent does not have to provide write access for such entities, and may return a zero-length string. If write access is implemented for an instance of entPhysicalSerialNum, and a value is written into the instance, the agent must retain the supplied value in the entPhysicalSerialNum instance associated with the same physical entity for as long as that entity remains instantiated. [cite_start]This includes instantiations across all re- initializations/reboots of the network management system, including those which result in a change of the physical entity's entPhysicalIndex value. [cite: 66, 67, 68, 69, 70, 71, 72, 73, 74, 75]"
                                        },
                                        entPhysicalMfgName: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.12',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The name of the manufacturer of this physical component. The preferred value is the manufacturer name string actually printed on the component itself (if present). Note that comparisons between instances of the entPhysicalModelName, entPhysicalFirmwareRev, entPhysicalSoftwareRev, and the entPhysicalSerialNum objects, are only meaningful amongst entPhysicalEntries with the same value of entPhysicalMfgName. [cite_start]If the manufacturer name string associated with the physical component is unknown to the agent, then this object will contain a zero-length string. [cite: 76, 77, 78]"
                                        },
                                        entPhysicalModelName: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.13',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The vendor-specific model name identifier string associated with this physical component. The preferred value is the customer-visible part number, which may be printed on the component itself. [cite_start]If the model name string associated with the physical component is unknown to the agent, then this object will contain a zero-length string. [cite: 78, 79, 80]"
                                        },
                                        entPhysicalAlias: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.14',
                                            type: 'SnmpAdminString',
                                            writable: true,
                                            syntax: 'SnmpAdminString (SIZE (0..32))',
                                            description: "This object is an 'alias' name for the physical entity as specified by a network manager, and provides a non-volatile 'handle' for the physical entity. On the first instantiation of an physical entity, the value of entPhysicalAlias associated with that entity is set to the zero-length string. However, agent may set the value to a locally unique default value, instead of a zero-length string. If write access is implemented for an instance of entPhysicalAlias, and a value is written into the instance, the agent must retain the supplied value in the entPhysicalAlias instance associated with the same physical entity for as long as that entity remains instantiated. [cite_start]This includes instantiations across all re- initializations/reboots of the network management system, including those which result in a change of the physical entity's entPhysicalIndex value. [cite: 81, 82, 83, 84]"
                                        },
                                        entPhysicalAssetID: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.15',
                                            type: 'SnmpAdminString',
                                            writable: true,
                                            syntax: 'SnmpAdminString (SIZE (0..32))',
                                            description: "This object is a user-assigned asset tracking identifier for the physical entity as specified by a network manager, and provides non-volatile storage of this information. On the first instantiation of an physical entity, the value of entPhysicalAssetID associated with that entity is set to the zero-length string. Not every physical component will have a asset tracking identifier, or even need one. Physical entities for which the associated value of the entPhysicalIsFRU object is equal to 'false(2)' (e.g., the repeater ports within a repeater module), do not need their own unique asset tracking identifier. An agent does not have to provide write access for such entities, and may instead return a zero-length string. If write access is implemented for an instance of entPhysicalAssetID, and a value is written into the instance, the agent must retain the supplied value in the entPhysicalAssetID instance associated with the same physical entity for as long as that entity remains instantiated. This includes instantiations across all re- initializations/reboots of the network management system, including those which result in a change of the physical entity's entPhysicalIndex value. [cite_start]If no asset tracking information is associated with the physical component, then this object will contain a zero- length string. [cite: 85, 86, 87, 88, 89, 90, 91]"
                                        },
                                        entPhysicalIsFRU: {
                                            OID: '1.3.6.1.2.1.47.1.1.1.1.16',
                                            type: 'TruthValue',
                                            writable: false,
                                            syntax: 'TruthValue',
                                            description: "This object indicates whether or not this physical entity is considered a 'field replaceable unit' by the vendor. If this object contains the value 'true(1)' then this entPhysicalEntry identifies a field replaceable unit. [cite_start]For all entPhysicalEntries which represent components that are permanently contained within a field replaceable unit, the value 'false(2)' should be returned for this object. [cite: 91, 92, 93]"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                entityLogical: {
                    OID: '1.3.6.1.2.1.47.1.2',
                    type: 'group',
                    [cite_start]description: 'The logical entity group. [cite: 5]',
                    children: {
                        entLogicalTable: {
                            OID: '1.3.6.1.2.1.47.1.2.1',
                            type: 'table',
                            [cite_start]description: "This table contains one row per logical entity. For agents which implement more than one naming scope, at least one entry must exist. Agents which instantiate all MIB objects within a single naming scope are not required to implement this table. [cite: 93, 94]",
                            children: {
                                entLogicalEntry: {
                                    OID: '1.3.6.1.2.1.47.1.2.1.1',
                                    type: 'row',
                                    rowIndex: 'entLogicalIndex',
                                    description: "Information about a particular logical entity. [cite_start]Entities may be managed by this agent or other SNMP agents (possibly) in the same chassis. [cite: 95]",
                                    children: {
                                        entLogicalIndex: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.1',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (1..2147483647)',
                                            description: "The value of this object uniquely identifies the logical entity. [cite_start]The value should be a small positive integer; index values for different logical entities are are not necessarily contiguous. [cite: 96]"
                                        },
                                        entLogicalDescr: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.2',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "A textual description of the logical entity. [cite_start]This object should contain a string which identifies the manufacturer's name for the logical entity, and should be set to a distinct value for each version of the logical entity. [cite: 97, 98]"
                                        },
                                        entLogicalType: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.3',
                                            type: 'AutonomousType',
                                            writable: false,
                                            syntax: 'AutonomousType',
                                            description: "An indication of the type of logical entity. This will typically be the OBJECT IDENTIFIER name of the node in the SMI's naming hierarchy which represents the major MIB module, or the majority of the MIB modules, supported by the logical entity. [cite_start]For example: a logical entity of a regular host/router -> mib-2 a logical entity of a 802.1d bridge -> dot1dBridge a logical entity of a 802.3 repeater -> snmpDot3RptrMgmt If an appropriate node in the SMI's naming hierarchy cannot be identified, the value 'mib-2' should be used. [cite: 99, 100, 101]"
                                        },
                                        entLogicalCommunity: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.4',
                                            type: 'OCTET STRING',
                                            writable: false,
                                            syntax: 'OCTET STRING (SIZE (0..255))',
                                            description: "An SNMPv1 or SNMPv2C community-string which can be used to access detailed management information for this logical entity. The agent should allow read access with this community string (to an appropriate subset of all managed objects) and may also return a community string based on the privileges of the request used to read this object. Note that an agent may return a community string with read-only privileges, even if this object is accessed with a read- write community string. However, the agent must take care not to return a community string which allows more privileges than the community string used to access this object. A compliant SNMP agent may wish to conserve naming scopes by representing multiple logical entities in a single 'default' naming scope. This is possible when the logical entities represented by the same value of entLogicalCommunity have no object instances in common. For example, 'bridge1' and 'repeater1' may be part of the main naming scope, but at least one additional community string is needed to represent 'bridge2' and 'repeater2'. Logical entities 'bridge1' and 'repeater1' would be represented by sysOREntries associated with the 'default' naming scope. For agents not accessible via SNMPv1 or SNMPv2C, the value of this object is the empty string. This object may also contain an empty string if a community string has not yet been assigned by the agent, or no community string with suitable access rights can be returned for a particular SNMP request. Note that this object is deprecated. Agents which implement SNMPv3 access should use the entLogicalContextEngineID and entLogicalContextName objects to identify the context associated with each logical entity. [cite_start]SNMPv3 agents may return a zero-length string for this object, or may continue to return a community string (e.g., tri-lingual agent support). [cite: 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112]"
                                        },
                                        entLogicalTAddress: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.5',
                                            type: 'TAddress',
                                            writable: false,
                                            syntax: 'TAddress',
                                            description: "The transport service address by which the logical entity receives network management traffic, formatted according to the corresponding value of entLogicalTDomain. For snmpUDPDomain, a TAddress is 6 octets long, the initial 4 octets containing the IP-address in network-byte order and the last 2 containing the UDP port in network-byte order. [cite_start]Consult 'Transport Mappings for Version 2 of the Simple Network Management Protocol' (RFC 1906 [RFC1906]) for further information on snmpUDPDomain. [cite: 112, 113, 114]"
                                        },
                                        entLogicalTDomain: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.6',
                                            type: 'TDomain',
                                            writable: false,
                                            syntax: 'TDomain',
                                            description: "Indicates the kind of transport service by which the logical entity receives network management traffic. [cite_start]Possible values for this object are presently found in the Transport Mappings for SNMPv2 document (RFC 1906 [RFC1906]). [cite: 114, 115]"
                                        },
                                        entLogicalContextEngineID: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.7',
                                            type: 'SnmpEngineIdOrNone',
                                            writable: false,
                                            syntax: 'SnmpEngineIdOrNone',
                                            description: "The authoritative contextEngineID that can be used to send an SNMP message concerning information held by this logical entity, to the address specified by the associated 'entLogicalTAddress/entLogicalTDomain' pair. This object, together with the associated entLogicalContextName object, defines the context associated with a particular logical entity, and allows access to SNMP engines identified by a contextEngineId and contextName pair. [cite_start]If no value has been configured by the agent, a zero-length string is returned, or the agent may choose not to instantiate this object at all. [cite: 115, 116, 117]"
                                        },
                                        entLogicalContextName: {
                                            OID: '1.3.6.1.2.1.47.1.2.1.1.8',
                                            type: 'SnmpAdminString',
                                            writable: false,
                                            syntax: 'SnmpAdminString',
                                            description: "The contextName that can be used to send an SNMP message concerning information held by this logical entity, to the address specified by the associated 'entLogicalTAddress/entLogicalTDomain' pair. This object, together with the associated entLogicalContextEngineID object, defines the context associated with a particular logical entity, and allows access to SNMP engines identified by a contextEngineId and contextName pair. [cite_start]If no value has been configured by the agent, a zero-length string is returned, or the agent may choose not to instantiate this object at all. [cite: 117, 118, 119]"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                entityMapping: {
                    OID: '1.3.6.1.2.1.47.1.3',
                    type: 'group',
                    [cite_start]description: 'The entity mapping group. [cite: 5]',
                    children: {
                        entLPMappingTable: {
                            OID: '1.3.6.1.2.1.47.1.3.1',
                            type: 'table',
                            [cite_start]description: "This table contains zero or more rows of logical entity to physical equipment associations. For each logical entity known by this agent, there are zero or more mappings to the physical equipment, and for each physical entity, there are zero or more mappings to the logical entities. [cite: 119, 120]",
                            children: {
                                entLPMappingEntry: {
                                    OID: '1.3.6.1.2.1.47.1.3.1.1',
                                    type: 'row',
                                    rowIndex: 'entLogicalIndex, entPhysicalIndex',
                                    [cite_start]description: "A logical entity to physical equipment mapping. [cite: 121]",
                                    children: {
                                        entLPMappingLogicalIndex: {
                                            OID: '1.3.6.1.2.1.47.1.3.1.1.1',
                                            type: 'Integer32',
                                            writable: false,
                                            syntax: 'INTEGER (1..2147483647)',
                                            [cite_start]description: "The value of entLogicalIndex for this entry. [cite: 122]"
                                        },
                                        entLPMappingPhysicalIndex: {
                                            OID: '1.3.6.1.2.1.47.1.3.1.1.2',
                                            type: 'PhysicalIndex',
                                            writable: false,
                                            syntax: 'PhysicalIndex',
                                            [cite_start]description: "The value of entPhysicalIndex for this entry. [cite: 123]"
                                        }
                                    }
                                }
                            }
                        },
                        entAliasMappingTable: {
                            OID: '1.3.6.1.2.1.47.1.3.2',
                            type: 'table',
                            [cite_start]description: "This table contains zero or more rows of alias-to-entity mappings. [cite: 124]",
                            children: {
                                entAliasMappingEntry: {
                                    OID: '1.3.6.1.2.1.47.1.3.2.1',
                                    type: 'row',
                                    rowIndex: 'entAliasMappingIdentifier, entPhysicalIndex',
                                    [cite_start]description: "A mapping between a vendor-specific alias and the physical entity that the alias corresponds to. [cite: 125]",
                                    children: {
                                        entAliasMappingIdentifier: {
                                            OID: '1.3.6.1.2.1.47.1.3.2.1.1',
                                            type: 'OCTET STRING',
                                            writable: true,
                                            syntax: 'OCTET STRING (SIZE (0..32))',
                                            [cite_start]description: "A vendor-specific alias identifier, typically a string which the vendor uses to refer to this physical entity. [cite: 126]"
                                        },
                                        entAliasMappingPhysicalIndex: {
                                            OID: '1.3.6.1.2.1.47.1.3.2.1.2',
                                            type: 'PhysicalIndex',
                                            writable: false,
                                            syntax: 'PhysicalIndex',
                                            [cite_start]description: "The value of entPhysicalIndex for this entry. [cite: 127]"
                                        },
                                        entAliasMappingCapabilities: {
                                            OID: '1.3.6.1.2.1.47.1.3.2.1.3',
                                            type: 'BITS',
                                            writable: false,
                                            enum: {
                                                0: 'canCreate',
                                                1: 'canDelete'
                                            },
                                            syntax: 'BITS { canCreate(0), canDelete(1) }',
                                            description: "Indicates the capabilities of the agent with respect to this alias mapping. The bit `canCreate(0)` indicates whether the agent can create new entries in this table. [cite_start]The bit `canDelete(1)` indicates whether the agent can delete existing entries in this table. [cite: 128]"
                                        },
                                        entAliasMappingStatus: {
                                            OID: '1.3.6.1.2.1.47.1.3.2.1.4',
                                            type: 'RowStatus',
                                            writable: true,
                                            syntax: 'RowStatus',
                                            description: "The status of this row. [cite_start]This object can be used to create or delete rows in the entAliasMappingTable. [cite: 129]"
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                entityGeneral: {
                    OID: '1.3.6.1.2.1.47.1.4',
                    type: 'group',
                    [cite_start]description: 'The entity general group. [cite: 5]',
                    children: {
                        entLastChange: {
                            OID: '1.3.6.1.2.1.47.1.4.1',
                            type: 'TimeStamp',
                            writable: false,
                            syntax: 'TimeStamp',
                            [cite_start]description: "The value of sysUpTime when the entPhysicalTable or entLogicalTable was last changed. This is the time when an entry was added, removed, or the entPhysicalParentRelPos of an entry changed. [cite: 130]"
                        },
                        entNotificationEnable: {
                            OID: '1.3.6.1.2.1.47.1.4.2',
                            type: 'TruthValue',
                            writable: true,
                            syntax: 'TruthValue',
                            [cite_start]description: "This object enables or disables the generation of entConfigChange notifications by the agent. [cite: 131]"
                        },
                        entConfigChange: {
                            OID: '1.3.6.1.2.1.47.1.4.0.1', // TRAP-TYPE is typically under 0.
                            type: 'NOTIFICATION-TYPE',
                            [cite_start]description: "A entConfigChange trap is sent by an agent when a row is added or deleted from the entPhysicalTable or entLogicalTable. [cite: 132]"
                        }
                    }
                }
            }
        }
    }
};