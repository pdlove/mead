async function updateSNMPValues(deviceId, host, community, rootOID) {
    const currentValues = await snmpWalkTree(host, community, rootOID);

    // Fetch the existing current values for the device from the DB
    const existingCurrentValues = await CurrentSNMPValue.findAll({
        where: { deviceId: deviceId }
    });

    const existingValuesMap = new Map();
    existingCurrentValues.forEach(entry => {
        existingValuesMap.set(entry.oid, entry);
    });

    // Current timestamp
    const now = new Date();

    // Process the new values from the SNMP walk
    for (let oid in currentValues) {
        const newValue = currentValues[oid];
        const oldEntry = existingValuesMap.get(oid);

        // If the OID exists, check if the value has changed
        if (oldEntry) {
            if (oldEntry.value !== newValue) {
                const timeDiffInSeconds = Math.floor((now - new Date(oldEntry.lastUpdated)) / 1000);
                const numericChange = isNaN(newValue) || isNaN(oldEntry.value) ? null : newValue - oldEntry.value;

                // Update current table
                await CurrentSNMPValue.update({
                    value: newValue,
                    numericChange: numericChange,
                    secondsSinceLastWalk: timeDiffInSeconds,
                    lastUpdated: now
                }, {
                    where: { deviceId: deviceId, oid: oid }
                });

                // Insert into historical table
                await HistoricalSNMPValue.create({
                    deviceId: deviceId,
                    oid: oid,
                    previousValue: oldEntry.value,
                    newValue: newValue,
                    changeType: 'changed',
                    numericChange: numericChange,
                    secondsSinceLastWalk: timeDiffInSeconds
                });
            }
        } else {
            // New entry, add to current and historical tables
            await CurrentSNMPValue.create({
                deviceId: deviceId,
                oid: oid,
                value: newValue,
                lastUpdated: now
            });

            await HistoricalSNMPValue.create({
                deviceId: deviceId,
                oid: oid,
                previousValue: null,
                newValue: newValue,
                changeType: 'added',
                numericChange: null,
                secondsSinceLastWalk: null
            });
        }
    }

    // Check for deleted OIDs (ones that were in the previous scan but are not in the current one)
    for (let [oid, oldEntry] of existingValuesMap.entries()) {
        if (!currentValues[oid]) {
            const timeDiffInSeconds = Math.floor((now - new Date(oldEntry.lastUpdated)) / 1000);

            // Mark as deleted in current table
            await CurrentSNMPValue.update({
                isDeleted: true,
                lastUpdated: now
            }, {
                where: { deviceId: deviceId, oid: oid }
            });

            // Insert into historical table as deleted
            await HistoricalSNMPValue.create({
                deviceId: deviceId,
                oid: oid,
                previousValue: oldEntry.value,
                newValue: null,
                changeType: 'deleted',
                numericChange: null,
                secondsSinceLastWalk: timeDiffInSeconds
            });
        }
    }
}
