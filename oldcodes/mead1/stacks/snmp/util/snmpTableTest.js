snmpTableDefinitions['prtLocalizationTable'] = { baseOID: '1.3.6.1.2.1.43.7.1', rowGroup: '1', columns: {
    1: { name: "prtLocalizationIndex", type: "number", writable: false },
    2: { name: "prtLocalizationLanguage", type: "string", writable: false },
    3: { name: "prtLocalizationCountry", type: "string", writable: false },
    4: { name: "prtLocalizationCharacterSet", type: "string", writable: false },
}};

snmpTableDefinitions['prtMediaPathTable'] = { baseOID: '1.3.6.1.2.1.43.13.4', rowGroup: '1', columns: {
    1: { name: "prtMediaPathIndex", type: "number", writable: false },
    2: { name: "prtMediaPathMaxSpeedPrintUnit", type: "enum", writable: false, enum: { 3: "tenThousandthsOfInches", 4: "micrometers" } },
    3: { name: "prtMediaPathMediaSizeUnit", type: "enum", writable: false, enum: { 3: "tenThousandthsOfInches", 4: "micrometers", 5: "charactersPerHour", 6: "linesPerHour", 7: "impressionsPerHour", 8: "sheetsPerHour", 9: "dotRowPerHour", 16: "feetPerHour", 17: "metersPerHour" } },
    4: { name: "prtMediaPathMaxSpeed", type: "number", writable: false },
    5: { name: "prtMediaPathMaxMediaFeedDir", type: "number", writable: false },
    6: { name: "prtMediaPathMaxMediaXFeedDir", type: "number", writable: false },
    7: { name: "prtMediaPathMinMediaFeedDir", type: "number", writable: false },
    8: { name: "prtMediaPathMinMediaXFeedDir", type: "number", writable: false },
    9: { name: "prtMediaPathType", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "longEdgeBindingDuplex", 4: "shortEdgeBindingDuplex", 5: "simplex" } },
    10: { name: "prtMediaPathDescription", type: "string", writable: false },
    11: { name: "prtMediaPathStatus", type: "number", writable: false },
}};

snmpTableDefinitions['prtChannelTable'] = { baseOID: '1.3.6.1.2.1.43.14.1', rowGroup: '1', columns: {
    1: { name: "prtChannelIndex", type: "number", writable: false },
    2: { name: "prtChannelType", type: "enum", writable: false, enum: { 1: "other", 3: "chSerialPort", 4: "chParallelPort", 5: "chIEEE1284Port", 6: "chSCSIPort", 7: "chAppleTalkPAP", 8: "chLPDServer", 9: "chNetwareRPrinter", 10: "chNetwarePServer", 11: "chPort9100", 12: "chAppSocket", 13: "chFTP", 14: "chTFTP", 15: "chDLCLLCPort", 16: "chIBM3270", 17: "chIBM5250", 18: "chFax", 19: "chIEEE1394", 20: "chTransport1", 21: "chCPAP", 22: "chDCERemoteProcCall", 23: "chONCRemoteProcCall", 24: "chOLE", 25: "chNamedPipe", 26: "chPCPrint", 27: "chServerMessageBlock", 28: "chDPMF", 29: "chDLLAPI", 30: "chVxDAPI", 31: "chSystemObjectManager", 32: "chDECLAT", 33: "chNPAP" } },
    3: { name: "prtChannelProtocolVersion", type: "string", writable: false },
    4: { name: "prtChannelCurrentJobCntlLangIndex", type: "number", writable: true },
    5: { name: "prtChannelDefaultPageDescLangIndex", type: "number", writable: true },
    6: { name: "prtChannelState", type: "enum", writable: true, enum: { 1: "other", 3: "printDataAccepted", 4: "noDataAccepted" } },
    7: { name: "prtChannelIfIndex", type: "number", writable: true },
    8: { name: "prtChannelStatus", type: "number", writable: false },
    9: { name: "prtChannelInformation", type: "string", writable: false },
}};

snmpTableDefinitions['prtConsoleDisplayBufferTable'] = { baseOID: '1.3.6.1.2.1.43.16.5', rowGroup: '1', columns: {
    1: { name: "prtConsoleDisplayBufferIndex", type: "number", writable: false },
    2: { name: "prtConsoleDisplayBufferText", type: "string", writable: false },
}};

snmpTableDefinitions['prtConsoleLightTable'] = { baseOID: '1.3.6.1.2.1.43.17.6', rowGroup: '1', columns: {
    1: { name: "prtConsoleLightIndex", type: "number", writable: false },
    2: { name: "prtConsoleOnTime", type: "number", writable: false },
    3: { name: "prtConsoleOffTime", type: "number", writable: false },
    4: { name: "prtConsoleColor", type: "number", writable: true, enum: { 1: "other", 2: "unknown", 3: "white", 4: "red", 5: "green", 6: "blue", 7: "cyan", 8: "magenta", 9: "yellow" } },
    5: { name: "prtConsoleDescription", type: "string", writable: true },
}};

snmpTableDefinitions['prtAlertTable'] = { baseOID: '1.3.6.1.2.1.43.18.1', rowGroup: '1', columns: {
    1: { name: "prtAlertIndex", type: "number", writable: false },
    2: { name: "prtAlertSeverityLevel", type: "enum", writable: false, enum: { 1: "other", 3: "critical", 4: "warning", 5: "warningBinaryChangeEvent" } },
    3: { name: "prtAlertTrainingLevel", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "untrained", 4: "trained", 5: "fieldService", 6: "management", 7: "noInterventionRequired" } },
    4: { name: "prtAlertGroup", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "hostResourcesMIBStorageTable", 4: "hostResourcesMIBDeviceTable", 5: "generalPrinter", 6: "cover", 7: "localization", 8: "input", 9: "output", 10: "marker", 11: "markerSupplies", 12: "markerColorant", 13: "mediaPath", 14: "channel", 15: "interpreter", 16: "consoleDisplayBuffer", 17: "consoleLights", 18: "alert", 30: "finDevice", 31: "finSupply", 32: "finSupplyMediaInput", 33: "finAttribute" } },
    5: { name: "prtAlertGroupIndex", type: "number", writable: false },
    6: { name: "prtAlertLocation", type: "number", writable: false },    
    7: { name: "prtAlertCode", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "coverOpen", 4: "coverClosed", 5: "interlockOpen", 6: "interlockClosed", 7: "configurationChange", 8: "jam", 9: "subunitMissing", 10: "subunitLifeAlmostOver", 
                            11: "subunitLifeOver", 12: "subunitAlmostEmpty", 13: "subunitEmpty", 14: "subunitAlmostFull", 15: "subunitFull", 16: "subunitNearLimit", 17: "subunitAtLimit", 18: "subunitOpened", 19: "subunitClosed", 20: "subunitTurnedOn", 21: "subunitTurnedOff", 
                            22: "subunitOffline", 23: "subunitPowerSaver", 24: "subunitWarmingUp", 25: "subunitAdded", 26: "subunitRemoved", 27: "subunitResourceAdded", 28: "subunitResourceRemoved", 29: "subunitRecoverableFailure", 30: "subunitUnrecoverableFailure", 
                            31: "subunitRecoverableStorageError", 32: "subunitUnrecoverableStorageError", 33: "subunitMotorFailure", 34: "subunitMemoryExhausted", 35: "subunitUnderTemperature", 36: "subunitOverTemperature", 37: "subunitTimingFailure", 38: "subunitThermistorFailure",
                            501: "doorOpen", 502: "doorClosed", 503: "powerUp", 504: "powerDown", 505: "printerNMSReset", 506: "printerManualReset", 507: "printerReadyToPrint", 801: "inputMediaTrayMissing", 802: "inputMediaSizeChange", 803: "inputMediaWeightChange", 
                            804: "inputMediaTypeChange", 805: "inputMediaColorChange", 806: "inputMediaFormPartsChange", 807: "inputMediaSupplyLow", 808: "inputMediaSupplyEmpty", 809: "inputMediaChangeRequest", 810: "inputManualInputRequest", 811: "inputTrayPositionFailure", 
                            812: "inputTrayElevationFailure", 813: "inputCannotFeedSizeSelected", 901: "outputMediaTrayMissing", 902: "outputMediaTrayAlmostFull", 903: "outputMediaTrayFull", 904: "outputMailboxSelectFailure", 1001: "markerFuserUnderTemperature", 
                            1002: "markerFuserOverTemperature", 1003: "markerFuserTimingFailure", 1004: "markerFuserThermistorFailure", 1005: "markerAdjustingPrintQuality", 1101: "markerTonerEmpty", 1102: "markerInkEmpty", 1103: "markerPrintRibbonEmpty", 
                            1104: "markerTonerAlmostEmpty", 1105: "markerInkAlmostEmpty", 1106: "markerPrintRibbonAlmostEmpty", 1107: "markerWasteTonerReceptacleAlmostFull", 1108: "markerWasteInkReceptacleAlmostFull", 1109: "markerWasteTonerReceptacleFull", 
                            1110: "markerWasteInkReceptacleFull", 1111: "markerOpcLifeAlmostOver", 1112: "markerOpcLifeOver", 1113: "markerDeveloperAlmostEmpty", 1114: "markerDeveloperEmpty", 1115: "markerTonerCartridgeMissing", 1301: "mediaPathMediaTrayMissing", 
                            1302: "mediaPathMediaTrayAlmostFull", 1303: "mediaPathMediaTrayFull", 1304: "mediaPathCannotDuplexMediaSelected", 1501: "interpreterMemoryIncrease", 1502: "interpreterMemoryDecrease", 1503: "interpreterCartridgeAdded", 1504: "interpreterCartridgeDeleted", 
                            1505: "interpreterResourceAdded", 1506: "interpreterResourceDeleted", 1507: "interpreterResourceUnavailable", 1509: "interpreterComplexPageEncountered", 1801: "alertRemovalOfBinaryChangeEntry" } },
    8: { name: "prtAlertDescription", type: "string", writable: false },
    9: { name: "prtAlertTime", type: "timespan", writable: false },
}};


snmpTableDefinitions['icmp'] = { baseOID: '1.3.6.1.2.1.5', rowGroup: '', rowIndex: '', columns: {
    1: { name: "icmpInMsgs", type: "number", writable: false },
    2: { name: "icmpInErrors", type: "number", writable: false },
    3: { name: "icmpInDestUnreachs", type: "number", writable: false },
    4: { name: "icmpInTimeExcds", type: "number", writable: false },
    5: { name: "icmpInParmProbs", type: "number", writable: false },
    6: { name: "icmpInSrcQuenchs", type: "number", writable: false },
    7: { name: "icmpInRedirects", type: "number", writable: false },
    8: { name: "icmpInEchos", type: "number", writable: false },
    9: { name: "icmpInEchoReps", type: "number", writable: false },
    10: { name: "icmpInTimestamps", type: "number", writable: false },
    11: { name: "icmpInTimestampReps", type: "number", writable: false },
    12: { name: "icmpInAddrMasks", type: "number", writable: false },
    13: { name: "icmpInAddrMaskReps", type: "number", writable: false },
    14: { name: "icmpOutMsgs", type: "number", writable: false },
    15: { name: "icmpOutErrors", type: "number", writable: false },
    16: { name: "icmpOutDestUnreachs", type: "number", writable: false },
    17: { name: "icmpOutTimeExcds", type: "number", writable: false },
    18: { name: "icmpOutParmProbs", type: "number", writable: false },
    19: { name: "icmpOutSrcQuenchs", type: "number", writable: false },
    20: { name: "icmpOutRedirects", type: "number", writable: false },
    21: { name: "icmpOutEchos", type: "number", writable: false },
    22: { name: "icmpOutEchoReps", type: "number", writable: false },
    23: { name: "icmpOutTimestamps", type: "number", writable: false },
    24: { name: "icmpOutTimestampReps", type: "number", writable: false },
    25: { name: "icmpOutAddrMasks", type: "number", writable: false },
    26: { name: "icmpOutAddrMaskReps", type: "number", writable: false },
}};

snmpTableDefinitions['tcp'] = { baseOID: '1.3.6.1.2.1.6', rowGroup: '', columns: {
    1: { name: "tcpRtoAlgorithm", type: "enum", writable: false, enum: { 1: "other", 2: "constant", 3: "rsre", 4: "vanj" } },
    2: { name: "tcpRtoMin", type: "number", writable: false },
    3: { name: "tcpRtoMax", type: "number", writable: false },
    4: { name: "tcpMaxConn", type: "SNMP_INT32", writable: false },
    5: { name: "tcpActiveOpens", type: "number", writable: false },
    6: { name: "tcpPassiveOpens", type: "number", writable: false },
    7: { name: "tcpAttemptFails", type: "number", writable: false },
    8: { name: "tcpEstabResets", type: "number", writable: false },
    9: { name: "tcpCurrEstab", type: "number", writable: false },
    10: { name: "tcpInSegs", type: "number", writable: false },
    11: { name: "tcpOutSegs", type: "number", writable: false },
    12: { name: "tcpRetransSegs", type: "number", writable: false },
    14: { name: "tcpInErrs", type: "number", writable: false },
    15: { name: "tcpOutRsts", type: "number", writable: false },
    16: { name: "tcpRetransAttempts", type: "number", writable: false },
    17: { name: "tcpKAInterval", type: "number", writable: true },
    18: { name: "tcpKAAttempts", type: "number", writable: true },
}};

snmpTableDefinitions['tcpConnTable'] = { baseOID: '1.3.6.1.2.1.6.13', rowGroup: '1', columns: {
    1: { name: "tcpConnState", type: "enum", writable: false, enum: { 1: "closed", 2: "listen", 3: "synSent", 4: "synReceived", 5: "established", 6: "finWait1", 7: "finWait2", 8: "closeWait", 9: "lastAck", 10: "closing", 11: "timeWait", 12: "deleteTCB" } },
    2: { name: "tcpConnLocalAddress", type: "string", writable: false },
    3: { name: "tcpConnLocalPort", type: "number", writable: false },
    4: { name: "tcpConnRemAddress", type: "string", writable: false },
    5: { name: "tcpConnRemPort", type: "number", writable: false },
}};

snmpTableDefinitions['udp'] = { baseOID: '1.3.6.1.2.1.7', rowGroup: '', columns: {
    1: { name: "udpInDatagrams", type: "number", writable: false },
    2: { name: "udpNoPorts", type: "number", writable: false },
    3: { name: "udpInErrors", type: "number", writable: false },
    4: { name: "udpOutDatagrams", type: "number", writable: false },
}};

snmpTableDefinitions['udpTable'] = { baseOID: '1.3.6.1.2.1.7.5', rowGroup: '1', columns: {
    1: { name: "udpLocalAddress", type: "string", writable: false },
    2: { name: "udpLocalPort", type: "number", writable: false },
}};

snmpTableDefinitions['snmp'] = { baseOID: '1.3.6.1.2.1.11', rowGroup: '', columns: {
    1: { name: "snmpInPkts", type: "number", writable: false },
    2: { name: "snmpOutPkts", type: "number", writable: false },
    3: { name: "snmpInBadVersions", type: "number", writable: false },
    4: { name: "snmpInBadCommunityNames", type: "number", writable: false },
    5: { name: "snmpInBadCommunityUses", type: "number", writable: false },
    6: { name: "snmpInASNParseErrs", type: "number", writable: false },
    7: { name: "snmpInBadTypes", type: "number", writable: false },
    8: { name: "snmpInTooBigs", type: "number", writable: false },
    9: { name: "snmpInNoSuchNames", type: "number", writable: false },
    10: { name: "snmpInBadValues", type: "number", writable: false },
    11: { name: "snmpInReadOnlys", type: "number", writable: false },
    12: { name: "snmpInGenErrs", type: "number", writable: false },
    13: { name: "snmpInTotalReqVars", type: "number", writable: false },
    14: { name: "snmpInTotalSetVars", type: "number", writable: false },
    15: { name: "snmpInGetRequests", type: "number", writable: false },
    16: { name: "snmpInGetNexts", type: "number", writable: false },
    17: { name: "snmpInSetRequests", type: "number", writable: false },
    18: { name: "snmpInGetResponses", type: "number", writable: false },
    19: { name: "snmpInTraps", type: "number", writable: false },
    20: { name: "snmpOutTooBigs", type: "number", writable: false },
    21: { name: "snmpOutNoSuchNames", type: "number", writable: false },
    22: { name: "snmpOutBadValues", type: "number", writable: false },
    23: { name: "snmpOutReadOnlys", type: "number", writable: false },
    24: { name: "snmpOutGenErrs", type: "number", writable: false },
    25: { name: "snmpOutGetRequests", type: "number", writable: false },
    26: { name: "snmpOutGetNexts", type: "number", writable: false },
    27: { name: "snmpOutSetRequests", type: "number", writable: false },
    28: { name: "snmpOutGetResponses", type: "number", writable: false },
    29: { name: "snmpOutTraps", type: "number", writable: false },
    30: { name: "snmpEnableAuthenTraps", type: "number", writable: true },
}};

snmpTableDefinitions['atPort'] = { baseOID: '1.3.6.1.2.1.13.3.1', rowGroup: '1', rowIndex: 'atportIndex', columns: {
    1: { name: "atportIndex", type: "number", writable: false },
    2: { name: "atportDescr", type: "string", writable: false },
    3: { name: "atportType", type: "enum", writable: false, enum: { 1: "other", 2: "localtalk", 3: "ethertalk1", 4: "ethertalk2", 5: "tokentalk", 6: "iptalk", 7: "serial-ppp", 8: "serial-nonstandard", 9: "virtual" } },
    4: { name: "atportNetStart", type: "string", writable: false },
    5: { name: "atportNetEnd", type: "string", writable: false },
    6: { name: "atportNetAddress", type: "hex", writable: false },
    7: { name: "atportStatus", type: "enum", writable: false, enum: { 1: "operational", 2: "unconfigured", 3: "off", 4: "invalid" } },
    8: { name: "atportNetConfig", type: "enum", writable: false, enum: { 1: "configured", 2: "garnered", 3: "guessed", 4: "unconfigured" } },
    9: { name: "atportZoneConfig", type: "enum", writable: false, enum: { 1: "configured", 2: "garnered", 3: "guessed", 4: "unconfigured" } },
    10: { name: "atportZone", type: "string", writable: false },
    11: { name: "atportIfIndex", type: "number", writable: false },
}};

snmpTableDefinitions['hrStorage'] = { baseOID: '1.3.6.1.2.1.25.2', rowGroup: '', columns: {
    2: { name: "hrMemorySize", type: "string", writable: false },
}};

snmpTableDefinitions['hrDeviceTable'] = { baseOID: '1.3.6.1.2.1.25.3.2', rowGroup: '1', columns: {
    1: { name: "hrDeviceIndex", type: "number", writable: false },
    2: { name: "hrDeviceType", type: "string", writable: false },
    3: { name: "hrDeviceDescr", type: "string", writable: false },
    4: { name: "hrDeviceID", type: "string", writable: false },
    5: { name: "hrDeviceStatus", type: "number", writable: false },
    6: { name: "hrDeviceErrors", type: "number", writable: false },
    7: { name: "atportStatus", type: "number", writable: false },
    8: { name: "atportNetConfig", type: "number", writable: false },
    9: { name: "atportZoneConfig", type: "number", writable: false },
    10: { name: "atportZone", type: "number", writable: false },
    11: { name: "atportIfIndex", type: "number", writable: false },
}};

snmpTableDefinitions['hrProcessorTable'] = { baseOID: '1.3.6.1.2.1.25.3.3', rowGroup: '1', columns: {
    1: { name: "hrProcessorFrwID", type: "string", writable: false },
    2: { name: "hrProcessorLoad", type: "number", writable: false },
}};

snmpTableDefinitions['hrNetworkTable'] = { baseOID: '1.3.6.1.2.1.25.3.4', rowGroup: '1', columns: {
    1: { name: "hrNetworkIfIndex", type: "number", writable: false },
}};

snmpTableDefinitions['hrPrinterTable'] = { baseOID: '1.3.6.1.2.1.25.3.5', rowGroup: '1', columns: {
    1: { name: "hrPrinterStatus", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "idle", 4: "printing", 5: "warmup" } },
    2: { name: "hrPrinterDetectedErrorState", type: "string", writable: false },
}};

snmpTableDefinitions['hrDiskStorageTable'] = { baseOID: '1.3.6.1.2.1.25.3.6', rowGroup: '1', columns: {
    1: { name: "hrDiskStorageAccess", type: "enum", writable: false, enum: { 1: "readWrite", 2: "readOnly" } },
    2: { name: "hrDiskStorageMedia", type: "enum", writable: false, enum: { 1: "other", 2: "unknown", 3: "hardDisk", 4: "floppyDisk", 5: "opticalDiskROM", 6: "opticalDiskWORM", 7: "opticalDiskRW", 8: "ramDisk" } },
    3: { name: "hrDiskStorageRemoveble", type: "SNMP_BOOL", writable: false },
    4: { name: "hrDiskStorageCapacity", type: "number", writable: false },
}};

snmpTableDefinitions['hrPartitionTable'] = { baseOID: '1.3.6.1.2.1.25.3.7', rowGroup: '1', columns: {
    1: { name: "hrPartitionIndex", type: "number", writable: false },
    2: { name: "hrPartitionLabel", type: "string", writable: false },
    3: { name: "hrPartitionID", type: "string", writable: false },
    4: { name: "hrPartitionSize", type: "number", writable: false },
    5: { name: "hrPartitionFSIndex", type: "number", writable: false },
}};

snmpTableDefinitions['prtGeneralTable'] = { baseOID: '1.3.6.1.2.1.43.5.1', rowGroup: '1', columns: {
    1: { name: "prtGeneralConfigChanges", type: "number", writable: false },
    2: { name: "prtGeneralCurrentLocalization", type: "number", writable: true },
    3: { name: "prtGeneralReset", type: "enum", writable: true, enum: { 3: "notResetting", 4: "powerCycleReset", 5: "resetToNVRAM", 6: "resetToFactoryDefaults" } },
    4: { name: "prtGeneralCurrentOperator", type: "string", writable: true },
    5: { name: "prtGeneralServicePerson", type: "string", writable: true },
    6: { name: "prtInputDefaultIndex", type: "number", writable: true },
    7: { name: "prtOutputDefaultIndex", type: "number", writable: true },
    8: { name: "prtMarkerDefaultIndex", type: "number", writable: true },
    9: { name: "prtMediaPathDefaultIndex", type: "number", writable: true },
    10: { name: "prtConsoleLocalization", type: "number", writable: true },
    11: { name: "prtConsoleNumberOfDisplayLines", type: "number", writable: false },
    12: { name: "prtConsoleNumberOfDisplayChars", type: "number", writable: false },
    13: { name: "prtConsoleDisable", type: "enum", writable: true, enum: { 3: "enabled", 4: "disabled" } },
    14: { name: "prtAuxiliarySheetStartupPage", type: "enum", writable: true, enum: { 1: "other", 3: "on", 4: "off", 5: "notPresent" } },
    15: { name: "prtAuxiliarySheetBannerPage", type: "enum", writable: true, enum: { 1: "other", 3: "on", 4: "off", 5: "notPresent" } },
    16: { name: "prtGeneralPrinterName", type: "string", writable: true },
    17: { name: "prtGeneralSerialNumber", type: "string", writable: true },
    18: { name: "prtAlertCriticalEvents", type: "number", writable: false },
    19: { name: "prtAlertAllEvents", type: "number", writable: false },
}};


snmpTableDefinitions['dot1xSuppConfigTable'] = { baseOID: '1.0.8802.1.1.1.1.3.1', rowGroup: '1', columns: {
    1: { name: "dot1xSuppPaeState", type: "enum", writable: false, enum: { 1: "disconnected", 2: "logoff", 3: "connecting", 4: "authenticating", 5: "authenticated", 6: "acquired", 7: "held" } },
    2: { name: "dot1xSuppHeldPeriod", type: "number", writable: true },
    3: { name: "dot1xSuppAuthPeriod", type: "number", writable: true },
    4: { name: "dot1xSuppStartPeriod", type: "number", writable: true },
    5: { name: "dot1xSuppMaxStart", type: "number", writable: true },
}};
snmpTableDefinitions['dot1xSuppStatsTable'] = { baseOID: '1.0.8802.1.1.1.1.3.2', rowGroup: '1', columns: {
    1: { name: "dot1xSuppEapolFramesRx", type: "number", writable: false },
    2: { name: "dot1xSuppEapolFramesTx", type: "number", writable: false },
    3: { name: "dot1xSuppEapolStartFramesTx", type: "number", writable: false },
    4: { name: "dot1xSuppEapolLogoffFramesTx", type: "number", writable: false },
    5: { name: "dot1xSuppEapolRespIdFramesTx", type: "number", writable: false },
    6: { name: "dot1xSuppEapolRespFramesTx", type: "number", writable: false },
    7: { name: "dot1xSuppEapolReqIdFramesRx", type: "number", writable: false },
    8: { name: "dot1xSuppEapolReqFramesRx", type: "number", writable: false },
    9: { name: "dot1xSuppInvalidEapolFramesRx", type: "number", writable: false },
    10: { name: "dot1xSuppEapLengthErrorFramesRx", type: "number", writable: false },
    11: { name: "dot1xSuppLastEapolFrameVersion", type: "number", writable: false },
    12: { name: "dot1xSuppLastEapolFrameSource", type: "hex", writable: false },
}};
snmpTableDefinitions['ARP'] = { baseOID: '1.3.6.1.2.1.3.1', rowGroup: '1', rowIndex: 'atIfIndex, atNetAddress', columns: {
    1: { name: "atIfIndex", type: "number", writable: true },
    2: { name: "atPhysAddress", type: "hex", writable: true },
    3: { name: "atNetAddress", type: "string", writable: true },
}};
snmpTableDefinitions['IP'] = { baseOID: '1.3.6.1.2.1.4', rowGroup: '', columns: {
    1: { name: "ipForwarding", type: "number", writable: true },
    2: { name: "ipDefaultTTL", type: "number", writable: true },
    3: { name: "ipInReceives", type: "number", writable: false },
    4: { name: "ipInHdrErrors", type: "number", writable: false },
    5: { name: "ipInAddrErrors", type: "number", writable: false },
    6: { name: "ipForwDatagrams", type: "number", writable: false },
    7: { name: "ipInUnknownProtos", type: "number", writable: false },
    8: { name: "ipInDiscards", type: "number", writable: false },
    9: { name: "ipInDelivers", type: "number", writable: false },
    10: { name: "ipOutRequests", type: "number", writable: false },
    11: { name: "ipOutDiscards", type: "number", writable: false },
    12: { name: "ipOutNoRoutes", type: "number", writable: false },
    13: { name: "ipReasmTimeout", type: "number", writable: false },
    14: { name: "ipReasmReqds", type: "number", writable: false },
    15: { name: "ipReasmOKs", type: "number", writable: false },
    16: { name: "ipReasmFails", type: "number", writable: false },
    17: { name: "ipFragOKs", type: "number", writable: false },
    18: { name: "ipFragFails", type: "number", writable: false },
    19: { name: "ipFragCreates", type: "number", writable: false },
    23: { name: "ipRoutingDiscards", type: "number", writable: false },
}};

snmpTableDefinitions['ipAddrTable'] = { baseOID: '1.3.6.1.2.1.4.20', rowGroup: '1', rowIndex: 'ipAdEntAddr', columns: {
    1: { name: "ipAdEntAddr", type: "string", writable: false },
    2: { name: "ipAdEntIfIndex", type: "number", writable: false },
    3: { name: "ipAdEntNetMask", type: "string", writable: false },
    4: { name: "ipAdEntBcastAddr", type: "number", writable: false },
    5: { name: "ipAdEntReasmMaxSize", type: "number", writable: false },
}};

snmpTableDefinitions['ipRouteTable'] = { baseOID: '1.3.6.1.2.1.4.21', rowGroup: '1', rowIndex: 'ipRouteDest', columns: {
    1: { name: "ipRouteDest", type: "string", writable: true },
    2: { name: "ipRouteIfIndex", type: "number", writable: true },
    3: { name: "ipRouteMetric1", type: "SNMP_INT32", writable: true },
    4: { name: "ipRouteMetric2", type: "SNMP_INT32", writable: true },
    5: { name: "ipRouteMetric3", type: "SNMP_INT32", writable: true },
    6: { name: "ipRouteMetric4", type: "SNMP_INT32", writable: true },
    7: { name: "ipRouteNextHop", type: "string", writable: true },
    8: { name: "ipRouteType", type: "enum", writable: true, enum: { 1: "other", 2: "invalid", 3: "direct", 4: "indirect" } },
    9: { name: "ipRouteProto", type: "enum", writable: false, enum: { 1: "other", 2: "local", 3: "netmgmt", 4: "icmp", 5: "egp", 6: "ggp", 7: "hello", 8: "rip", 9: "is-is", 10: "es-is", 11: "ciscoIgrp", 12: "bbnSpfIgp", 13: "ospf", 14: "bgp" } },
    10: { name: "ipRouteAge", type: "number", writable: true },
    11: { name: "ipRouteMask", type: "string", writable: true },
    12: { name: "ipRouteMetric5", type: "SNMP_INT32", writable: true },
    13: { name: "ipRouteInfo", type: "string", writable: false },
}};

