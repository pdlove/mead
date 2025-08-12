// src/routes/deviceRoutes.js
const express = require('express');
const prisma = require('../prismaClient');
const router = express.Router();

// Helper to validate IP address format (basic regex)
// IMPORTANT: For production, consider using a more robust validation library like 'validator'
const isValidIpAddress = (ip) => {
    if (!ip || typeof ip !== 'string') return false;

    // Basic IPv4 regex
    const ipv4Regex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (ipv4Regex.test(ip)) {
        return ip.split('.').every(segment => {
            const num = parseInt(segment, 10);
            return num >= 0 && num <= 255;
        });
    }

    // Basic IPv6 check (very simplified, a full regex is much longer)
    // This will catch most common forms but not all valid IPv6 representations
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$/;
    if (ip.includes(':') && ipv6Regex.test(ip)) {
        return true;
    }

    return false;
};

// --- Existing Device CRUD Routes ---

// GET all devices
router.get('/', async (req, res) => {
    try {
        const devices = await prisma.device.findMany({
            include: {
                category: true, // Keep existing includes
                parent: true,
                childDevices: true,
                // NEW: Include recent ping results for sparklines
                pingResults: {
                    take: 20, // Get the last 20 ping results
                    orderBy: {
                        timestamp: 'desc', // Order by most recent first
                    },
                    select: { // Select only necessary fields to keep payload size down
                        latency: true,
                        isReachable: true,
                        timestamp: true,
                    }
                },
            },
            orderBy: {
                name: 'asc' // Order devices by name
            }
        });
        res.json(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
        res.status(500).json({ message: 'Failed to fetch devices', error: error.message });
    }
});

// GET a single device by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const device = await prisma.device.findUnique({
            where: { id },
            include: { category: true, parent: true, childDevices: true },
        });
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json(device);
    } catch (error) {
        console.error('Error fetching device:', error);
        res.status(500).json({ message: 'Failed to fetch device', error: error.message });
    }
});

// POST a new device
router.post('/', async (req, res) => {
    const { name, ipAddress, categoryId, parentId, description, notifyEnabled, model, type, macAddress, isDHCP } = req.body;
    try {
        const newDevice = await prisma.device.create({
            data: {
                name,
                ipAddress,
                categoryId,
                parentId: parentId || null,
                description: description || null, // Maps to connectionNotes in DB
                notifyEnabled: notifyEnabled ?? true,
                model: model || null,
                type: type || null,
                macAddress: macAddress || null,
                isDHCP: isDHCP ?? false,
            },
        });
        res.status(201).json(newDevice);
    } catch (error) {
        console.error('Error creating device:', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('ipAddress')) {
            return res.status(409).json({ message: 'A device with this IP Address already exists.' });
        }
        res.status(500).json({ message: 'Failed to create device', error: error.message });
    }
});

// PUT (update) an existing device
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, ipAddress, categoryId, parentId, description, notifyEnabled, model, type, macAddress, isDHCP } = req.body;
    try {
        const updatedDevice = await prisma.device.update({
            where: { id },
            data: {
                name,
                ipAddress,
                categoryId,
                parentId: parentId || null,
                description: description || null, // Maps to connectionNotes in DB
                notifyEnabled: notifyEnabled ?? true,
                model: model || null,
                type: type || null,
                macAddress: macAddress || null,
                isDHCP: isDHCP ?? false,
            },
        });
        res.json(updatedDevice);
    } catch (error) {
        console.error('Error updating device:', error);
        if (error.code === 'P2002' && error.meta?.target?.includes('ipAddress')) {
            return res.status(409).json({ message: 'A device with this IP Address already exists.' });
        } else if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Device not found.' });
        }
        res.status(500).json({ message: 'Failed to update device', error: error.message });
    }
});

// DELETE a device
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Check for children devices before deleting
        const childrenCount = await prisma.device.count({
            where: { parentId: id },
        });

        if (childrenCount > 0) {
            return res.status(400).json({ message: 'Cannot delete device because it has child devices. Please delete children first.' });
        }

        await prisma.device.delete({
            where: { id },
        });
        res.status(204).send(); // No content for successful deletion
    } catch (error) {
        console.error('Error deleting device:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Device not found.' });
        }
        res.status(500).json({ message: 'Failed to delete device', error: error.message });
    }
});


// --- NEW ROUTE: POST /api/devices/import ---
router.post('/import', async (req, res) => {
    const devicesToImport = req.body; // This should be an array of objects from the frontend

    if (!Array.isArray(devicesToImport) || devicesToImport.length === 0) {
        return res.status(400).json({ message: 'No device data provided for import.' });
    }

    const importResults = {
        totalProcessed: devicesToImport.length,
        successfulImports: 0,
        failedImports: 0,
        errors: [],
        warnings: [],
        ipAddressToDbIdMap: new Map() // Temp map: CSV IP -> DB ID for parent linking
    };

    // Use a Prisma transaction to ensure atomicity for the entire import process.
    // If any operation within the transaction fails, all changes are rolled back.
    try {
        await prisma.$transaction(async (tx) => {
            // Fetch all categories once to map names to IDs efficiently
            const categories = await tx.deviceCategory.findMany();
            const categoryMap = new Map(categories.map(cat => [cat.name.toLowerCase(), cat.id]));

            // --- Pass 1: Create or Update Devices ---
            for (const [index, csvDevice] of devicesToImport.entries()) {
                const { ipAddress, name, type, categoryName, model, parentIP, description } = csvDevice;
                const rowNum = index + 2; // CSV row number (1 for headers, +1 for 0-indexed array)

                // 1. Basic field validation
                if (!ipAddress || !name || !categoryName) {
                    importResults.failedImports++;
                    importResults.errors.push({
                        row: rowNum,
                        ipAddress: ipAddress || 'N/A',
                        name: name || 'N/A',
                        reason: 'Missing required fields (IP Address, Name, Category).'
                    });
                    continue; // Skip to next device in CSV
                }

                if (!isValidIpAddress(ipAddress)) {
                    importResults.failedImports++;
                    importResults.errors.push({
                        row: rowNum,
                        ipAddress,
                        name,
                        reason: 'Invalid IP Address format.'
                    });
                    continue;
                }

                // 2. Resolve Category Name to ID
                const categoryId = categoryMap.get(categoryName.toLowerCase());
                if (!categoryId) {
                    importResults.failedImports++;
                    importResults.errors.push({
                        row: rowNum,
                        ipAddress,
                        name,
                        reason: `Category "${categoryName}" not found. Please create it first.`
                    });
                    continue;
                }

                try {
                    // Upsert device: If device with this IP exists, update it; otherwise, create it.
                    const upsertedDevice = await tx.device.upsert({
                        where: { ipAddress: ipAddress }, // Unique identifier for upsert
                        update: {
                            name: name,
                            type: type || null,
                            categoryId: categoryId,
                            model: model || null,
                            description: description || null, // Maps to connectionNotes
                            // parentId will be updated in the second pass
                            // Other fields not in CSV (like notifyEnabled, isDHCP) retain their existing values
                            // or can be explicitly set based on business logic.
                        },
                        create: {
                            ipAddress: ipAddress,
                            name: name,
                            type: type || null,
                            categoryId: categoryId,
                            model: model || null,
                            description: description || null, // Maps to connectionNotes
                            notifyEnabled: true, // Default for new devices
                            isDHCP: false,      // Default for new devices
                            // parentId will be set in the second pass
                        },
                    });

                    // Store the mapping from the CSV's IP to the actual database ID
                    importResults.ipAddressToDbIdMap.set(upsertedDevice.ipAddress, upsertedDevice.id);
                    importResults.successfulImports++;

                } catch (dbError) {
                    // Catch database-specific errors during upsert (e.g., other unique constraints)
                    importResults.failedImports++;
                    importResults.errors.push({
                        row: rowNum,
                        ipAddress,
                        name,
                        reason: `Database error during upsert: ${dbError.message}`
                    });
                    console.error(`Error upserting device at row ${rowNum} (${ipAddress}):`, dbError);
                }
            }

            // --- Pass 2: Link Parent Devices ---
            // This pass is only needed if there were successful imports in the first pass
            if (importResults.successfulImports > 0) {
                for (const [index, csvDevice] of devicesToImport.entries()) {
                    const { ipAddress, parentIP } = csvDevice;
                    const rowNum = index + 2;

                    // Only process devices that have a parentIP specified in CSV
                    if (!parentIP) {
                        continue;
                    }

                    const childDbId = importResults.ipAddressToDbIdMap.get(ipAddress);
                    const parentDbId = importResults.ipAddressToDbIdMap.get(parentIP);

                    // If the child device wasn't successfully processed in Pass 1, skip.
                    if (!childDbId) {
                        // Error already logged in Pass 1 for this device if it failed.
                        continue;
                    }

                    // Check if parent device exists (either imported or existing in DB)
                    if (!parentDbId) {
                        importResults.warnings.push({
                            row: rowNum,
                            ipAddress,
                            name: csvDevice.name,
                            reason: `Parent device with IP "${parentIP}" not found in imported data or existing database.`
                        });
                        continue; // Cannot link if parent is unknown
                    }

                    // Prevent a device from being its own parent
                    if (childDbId === parentDbId) {
                        importResults.warnings.push({
                            row: rowNum,
                            ipAddress,
                            name: csvDevice.name,
                            reason: `Device cannot be its own parent. Skipping parent link for '${parentIP}'.`
                        });
                        continue;
                    }

                    try {
                        // Update the child device's parentId
                        await tx.device.update({
                            where: { id: childDbId },
                            data: { parentId: parentDbId },
                        });
                    } catch (linkError) {
                        // Catch database errors during parent linking
                        importResults.warnings.push({
                            row: rowNum,
                            ipAddress,
                            name: csvDevice.name,
                            reason: `Failed to link parent (IP: ${parentIP}): ${linkError.message}`
                        });
                        console.error(`Error linking parent for device ${ipAddress}:`, linkError);
                    }
                }
            }
        }, {
            // Configure transaction options (e.g., timeout for large imports)
            timeout: 100000 // 100 seconds
        });

        // --- Final Response after successful transaction ---
        if (importResults.failedImports > 0) {
            // Respond with 202 Accepted if some records failed but others succeeded
            return res.status(202).json({
                message: `CSV import completed with ${importResults.successfulImports} successes and ${importResults.failedImports} failures.`,
                summary: {
                    totalProcessed: importResults.totalProcessed,
                    successfulImports: importResults.successfulImports,
                    failedImports: importResults.failedImports,
                },
                errors: importResults.errors,
                warnings: importResults.warnings
            });
        }

        // Respond with 200 OK if all were successful
        res.status(200).json({
            message: `CSV imported successfully! ${importResults.successfulImports} devices processed.`,
            summary: {
                totalProcessed: importResults.totalProcessed,
                successfulImports: importResults.successfulImports,
                failedImports: importResults.failedImports,
            },
            warnings: importResults.warnings
        });

    } catch (transactionError) {
        // This catch block will execute if the entire transaction fails and rolls back
        console.error('CSV Import Transaction Failed (critical error):', transactionError);
        res.status(500).json({
            message: 'CSV import failed due to a critical server error. No changes were applied.',
            error: transactionError.message,
            // Include collected individual errors even if the transaction rolled back,
            // as they point to the root cause of the rollback.
            details: importResults.errors
        });
    }
});

module.exports = router;