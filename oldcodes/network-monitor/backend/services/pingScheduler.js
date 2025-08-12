const prisma = require('../prismaClient');
const net = require('net-ping'); // <--- Changed: Use net-ping
const pLimit = require('p-limit').default;

// Configuration for pinging
const PING_CONCURRENCY_LIMIT = 25;
const PING_TIMEOUT_SECONDS = 2; // Timeout for each individual ping command

// How often the scheduler wakes up to check which groups are due for polling
const SCHEDULER_CHECK_INTERVAL_MS = 30 * 1000; // Every 30 seconds

// In-memory map to track when each frequency group was last polled.
const lastPolledTimes = new Map();

// --- net-ping Session Setup ---
// Create a persistent net-ping session outside the pingDevice function
// This avoids recreating the session for every ping, which is efficient.
const pingSession = net.createSession({
    timeout: PING_TIMEOUT_SECONDS * 1000, // net-ping expects timeout in milliseconds
    // Optional: Specify IPv4 only if preferred, though usually auto-detects
    // networkProtocol: net.NetworkProtocol.IPv4,
    // Optional: Increase retries for more reliable pinging
    // retries: 1,
});

/**
 * Fetches all enabled devices and groups them by their category's polling frequency.
 * (This function remains the same as before)
 */
async function claimDeviceCategory() {
    try {
        const claimedCategory = await prisma.deviceCategory.findFirst({
            where: {
                nextPoll: {
                    lt: new Date(),
                },
                claimedNode: null,
            },
            orderBy: {
                nextPoll: 'asc',
            },
        });

        if (!claimedCategory) {
            console.log('No due categories to poll right now.');
            return;
        }

        // Claim it
        const nodeId = 'poller-1'; // This should uniquely identify the worker

        await prisma.deviceCategory.update({
            where: {
                id: claimedCategory.id,
                claimedNode: null
            },
            data: {
                claimedNode: nodeId,
                claimHeartbeat: new Date()
            },
        });

        await new Promise((resolve) => setTimeout(resolve, 500)); // Short delay to make sure SQL update is processed.

        const verified = await prisma.deviceCategory.findUnique({
            where: { id: claimedCategory.id },
        });

        if (verified.claimedNode !== nodeId) {
            console.log('Claim lost, another worker took over.');
            return;
        }
        //TODO: Add table for monitoring types and return it here.
        const devicesToPoll = await prisma.device.findMany({
            where: {
                categoryId: claimedCategory.id,
            },
            select: {
                id: true,
                name: true,
                ipAddress: true,
            },
        });

        return devicesToPoll;
    } catch (error) {
        console.error("Error fetching and grouping devices for ping cycle:", error);
        return new Map();
    }
}

/**
 * Pings a single device using the 'net-ping' library.
 * Returns a Promise that resolves with the ping results.
 * @param {Object} device The device object to ping.
 * @returns {Promise<Object>} A promise resolving to an object containing ping results for the device.
 */
async function pingDevice(device) {
    return new Promise(resolve => {
        pingSession.pingHost(device.ipAddress, (error, target, sent, rcvd) => {
            if (error) {
                console.error(`Error pinging ${device.ipAddress}:`, error.toString());
                resolve({
                    deviceId: device.id,
                    isReachable: false,
                    latency: null,
                    error: `Ping failed: ${error.toString()}`,
                });
            } else {
                const latency = rcvd - sent; // Latency is in milliseconds
                resolve({
                    deviceId: device.id,
                    isReachable: true,
                    latency: latency,
                    error: null,
                });
            }
        });
    });
}

/**
 * Processes a batch of devices: pings them concurrently and saves results to DB.
 * (This function remains largely the same, but now uses pingDevice which is net-ping based)
 */
async function processDeviceBatch(batch) {
    if (batch.length === 0) return;

    const limit = pLimit(PING_CONCURRENCY_LIMIT);
    const pingPromises = batch.map(device => limit(() => pingDevice(device)));

    const pingResults = await Promise.allSettled(pingPromises);

    const updateOperations = [];
    const createPingResultOperations = [];

    pingResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
            const pingData = result.value;

            updateOperations.push(
                prisma.device.update({
                    where: { id: pingData.deviceId },
                    data: {
                        isOnline: pingData.isReachable,
                        lastLatency: pingData.latency,
                        lastSeen: pingData.isReachable ? new Date() : undefined,
                    },
                })
            );

            createPingResultOperations.push(
                prisma.pingResult.create({
                    data: {
                        deviceId: pingData.deviceId,
                        isReachable: pingData.isReachable,
                        latency: pingData.latency,
                        error: pingData.error,
                        timestamp: new Date(),
                    },
                })
            );
        } else if (result.status === 'rejected') {
            console.error("Promise rejected during batch ping:", result.reason);
        }
    });

    try {
        await prisma.$transaction([
            ...updateOperations,
            ...createPingResultOperations,
        ], {
            timeout: 60000
        });
        console.log(`Processed batch of ${batch.length} devices. Saved results to DB.`);
    } catch (dbError) {
        console.error(`Error saving ping results for batch to database:`, dbError);
    }
}

/**
 * Main function to run the scheduled ping cycle.
 * (This function remains the same)
 */
async function scheduledPingCycle() {
    console.log(`[${new Date().toISOString()}] Initiating scheduled ping cycle...`);
    const groupedDevices = await getDevicesGroupedByFrequency();
    const currentTime = Date.now();

    for (const [frequency, devicesInGroup] of groupedDevices.entries()) {
        const lastRun = lastPolledTimes.get(frequency) || 0;
        const nextRunDue = lastRun + (frequency * 1000);

        if (currentTime >= nextRunDue) {
            console.log(`Polling group with frequency ${frequency}s (Devices: ${devicesInGroup.length})`);

            const batches = [];
            for (let i = 0; i < devicesInGroup.length; i += PING_CONCURRENCY_LIMIT) {
                batches.push(devicesInGroup.slice(i, i + PING_CONCURRENCY_LIMIT));
            }

            for (const batch of batches) {
                await processDeviceBatch(batch);
            }
            lastPolledTimes.set(frequency, currentTime);
        } else {
            console.log(`Group with frequency ${frequency}s not yet due. Next run in ~${Math.round((nextRunDue - currentTime) / 1000)}s`);
        }
    }
    console.log(`[${new Date().toISOString()}] Scheduled ping cycle finished.`);
}

// Global variable to hold the interval ID for the main scheduler
let mainSchedulerInterval = null;

/**
 * Starts the main ping scheduler.
 */
function startPingScheduler() {
    if (mainSchedulerInterval) {
        console.warn("Ping scheduler already running. Skipping start.");
        return;
    }
    console.log("Starting main ping scheduler...");
    // Run immediately on start, then set the interval
    scheduledPingCycle();
    mainSchedulerInterval = setInterval(scheduledPingCycle, SCHEDULER_CHECK_INTERVAL_MS);
}

/**
 * Stops the main ping scheduler and closes the net-ping session.
 */
function stopPingScheduler() {
    if (mainSchedulerInterval) {
        console.log("Stopping ping scheduler...");
        clearInterval(mainSchedulerInterval);
        mainSchedulerInterval = null;
    }
    // IMPORTANT: Close the net-ping session when stopping the scheduler
    if (pingSession) {
        pingSession.close();
        console.log("Net-ping session closed.");
    }
}

module.exports = { startPingScheduler, stopPingScheduler };