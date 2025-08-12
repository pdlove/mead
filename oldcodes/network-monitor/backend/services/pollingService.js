// backend/services/pollingService.js
const net = require('net-ping');
const prisma = require('../prismaClient');
const { sendEmailAlert } = require('./emailService'); // Import email service

// Options for net-ping
const sessionOptions = {
    networkProtocol: net.NetworkProtocol.IPv4,
    packetSize: 16,
    retries: 1,
    timeout: 2000, // Timeout for each ping in ms
    ttl: 128,
    // On Linux/macOS, 'raw: true' often requires elevated privileges (sudo or capabilities)
    // On Windows, if 'raw: false', it might use UDP which can be less reliable for true ICMP
    raw: true
};

const session = net.createSession(sessionOptions);

// To store setInterval IDs for each device
const devicePollingJobs = {};
// To store rapid poll interval IDs
const rapidPollIntervals = {};

async function pollDevice(device) {
    if (!device.ipAddress) {
        console.warn(`Device ${device.name} (ID: ${device.id}) has no IP address. Skipping poll.`);
        return { latency: null, alive: false };
    }

    try {
        const category = await prisma.deviceCategory.findUnique({ where: { id: device.categoryId } });
        if (!category) {
            console.error(`Category not found for device ${device.name}. Skipping poll.`);
            return { latency: null, alive: false };
        }

        return new Promise((resolve) => {
            session.pingHost(device.ipAddress, async (error, target, sent, rcvd) => {
                let latency = -1; // -1 for missed poll
                let alive = false;

                if (error) {
                    // --- START DEBUGGING LOGS & ROBUST INSTANCEOF CHECK ---
                    console.log(`--- Polling Error Debug for ${device.name} (${device.ipAddress}) ---`);
                    console.log(`Error object:`, error);
                    console.log(`Type of net.HostNotFoundError:`, typeof net.HostNotFoundError);
                    console.log(`Value of net.HostNotFoundError:`, net.HostNotFoundError);

                    if (typeof net.HostNotFoundError === 'function' && error instanceof net.HostNotFoundError) {
                        console.log(`Host ${target} not found.`);
                    } else if (typeof net.SessionStoppedError === 'function' && error instanceof net.SessionStoppedError) {
                        console.log(`Ping session stopped.`);
                    } else if (error && error.message) {
                        // Catch common error messages
                        if (error.message.includes('Host is unreachable')) {
                            console.log(`Host ${target} is unreachable.`);
                        } else if (error.message.includes('Permission denied')) {
                            console.error(`Permission denied error when pinging ${target}. Remember net-ping often requires elevated privileges (sudo or capabilities).`);
                        } else {
                            console.error(`Generic error pinging ${target}: ${error.message}`);
                        }
                    } else {
                        console.error(`Unknown error type pinging ${target}:`, error);
                    }
                    console.log(`--- End Polling Error Debug ---`);
                } else {
                    latency = rcvd - sent;
                    alive = true;
                }

                // ... (rest of your existing code for saving poll latency, updating device, and handling alerts) ...
                await prisma.pollLatency.create({
                    data: {
                        deviceId: device.id,
                        latencyMs: latency,
                    }},{timeout: 100000}
                );

                await prisma.device.update({
                    where: { id: device.id },
                    data: {
                        lastPoll: new Date(),
                        lastResponse: alive ? new Date() : device.lastResponse,
                    },
                }, {timeout: 100000});

                console.log(`Polled ${device.name} (${device.ipAddress}): ${alive ? `Latency: ${latency}ms` : 'Missed'}`);

                await handleDeviceAlerts(device, category, alive, latency);

                resolve({ latency, alive });
            });
        });
    } catch (error) {
        console.error(`Unexpected error during pollDevice for ${device.name} (${device.ipAddress}):`, error);
        return { latency: null, alive: false };
    }
}

async function handleDeviceAlerts(device, category, isAlive, latency) {
    const emailSettings = await prisma.emailSetting.findFirst();
    const toAddresses = emailSettings ? emailSettings.toAddresses : '';

    if (!toAddresses) {
        console.warn('No email recipients configured. Skipping email alerts.');
        return;
    }

    // Fetch relevant recent polls to check thresholds
    const requiredPollsCount = Math.max(category.notifyDownPolls, category.notifyUpPolls, 1);
    const relevantPolls = await prisma.pollLatency.findMany({
        where: {
            deviceId: device.id,
            timestamp: {
                gte: new Date(Date.now() - (category.pollInterval * (requiredPollsCount + 2) * 1000)) // Fetch enough for threshold + buffer
            }
        },
        orderBy: {
            timestamp: 'desc'
        },
        take: requiredPollsCount
    });

    const missedPolls = relevantPolls.filter(p => p.latencyMs === -1).length;
    const successfulPolls = relevantPolls.filter(p => p.latencyMs !== -1).length;

    const currentDevice = await prisma.device.findUnique({ where: { id: device.id } });

    // Down Alert
    if (category.notifyDownPolls !== -1 && missedPolls >= category.notifyDownPolls && !currentDevice.downNotificationSent) {
        const subject = `ALERT: Device Down - ${device.name} (${device.ipAddress})`;
        const text = `The device "${device.name}" (${device.ipAddress}) has missed ${missedPolls} consecutive polls.`;
        await sendEmailAlert(subject, text, toAddresses);
        await prisma.device.update({ where: { id: device.id }, data: { downNotificationSent: true } });
    }

    // Up Alert (only if down notification was previously sent)
    if (category.notifyUpPolls !== -1 && successfulPolls >= category.notifyUpPolls && currentDevice.downNotificationSent) {
        const subject = `NOTIFICATION: Device Up - ${device.name} (${device.ipAddress})`;
        const text = `The device "${device.name}" (${device.ipAddress}) is now back online after ${successfulPolls} successful polls.`;
        await sendEmailAlert(subject, text, toAddresses);
        await prisma.device.update({ where: { id: device.id }, data: { downNotificationSent: false } });
    }
}


async function startDevicePolling(device) {
    if (!device.ipAddress) {
        console.warn(`Cannot start polling for device ${device.name} (ID: ${device.id}) - no IP address.`);
        return;
    }

    const category = await prisma.deviceCategory.findUnique({ where: { id: device.categoryId } });
    if (!category) {
        console.error(`Category not found for device ${device.name}. Cannot start polling.`);
        return;
    }

    const pollIntervalMs = category.pollInterval * 1000;

    // Clear existing interval if any
    if (devicePollingJobs[device.id]) {
        clearInterval(devicePollingJobs[device.id]);
    }

    // Immediately poll once then start interval
    pollDevice(device);
    devicePollingJobs[device.id] = setInterval(() => pollDevice(device), pollIntervalMs);
    console.log(`Started polling for ${device.name} (${device.ipAddress}) every ${category.pollInterval}s.`);
}

function stopDevicePolling(deviceId) {
    if (devicePollingJobs[deviceId]) {
        clearInterval(devicePollingJobs[deviceId]);
        delete devicePollingJobs[deviceId];
        console.log(`Stopped regular polling for device ID: ${deviceId}`);
    }
}

async function initializeAllDevicePolling() {
    // Stop all currently running jobs first to prevent duplicates
    for (const deviceId in devicePollingJobs) {
        stopDevicePolling(deviceId);
    }
    // Also clear any rapid polls that might be running
    for (const deviceId in rapidPollIntervals) {
        clearInterval(rapidPollIntervals[deviceId]);
        clearTimeout(rapidPollIntervals[`${deviceId}-timeout`]);
        delete rapidPollIntervals[deviceId];
        delete rapidPollIntervals[`${deviceId}-timeout`];
    }


    const devices = await prisma.device.findMany({
        where: { ipAddress: { not: null } }, // Only poll devices with an IP
        include: { category: true }
    });
    for (const device of devices) {
        await startDevicePolling(device);
    }
    console.log(`Initialized regular polling for ${devices.length} devices.`);
}

async function startRapidPolling(deviceId, intervalSeconds, durationMinutes) {
    const device = await prisma.device.findUnique({ where: { id: deviceId }, include: { deviceCategory: true } });
    if (!device || !device.ipAddress) {
        throw new Error('Device not found or no IP for rapid poll.');
    }

    // Clear any existing rapid poll for this device
    if (rapidPollIntervals[deviceId]) {
        clearInterval(rapidPollIntervals[deviceId]);
        clearTimeout(rapidPollIntervals[`${deviceId}-timeout`]);
    }

    const rapidPollIntervalMs = intervalSeconds * 1000;
    const rapidPollDurationMs = durationMinutes * 60 * 1000;

    console.log(`Starting rapid poll for ${device.name} every ${intervalSeconds}s for ${durationMinutes} mins.`);

    // Immediately poll once then start interval
    await pollDevice(device);
    rapidPollIntervals[deviceId] = setInterval(async () => {
        await pollDevice(device);
    }, rapidPollIntervalMs);

    // Set a timeout to stop rapid polling after the duration
    rapidPollIntervals[`${deviceId}-timeout`] = setTimeout(() => {
        clearInterval(rapidPollIntervals[deviceId]);
        delete rapidPollIntervals[deviceId];
        delete rapidPollIntervals[`${deviceId}-timeout`];
        console.log(`Rapid polling stopped for ${device.name}.`);
    }, rapidPollDurationMs);
}


module.exports = {
    initializeAllDevicePolling,
    startDevicePolling,
    stopDevicePolling,
    pollDevice, // Export for manual poll calls
    startRapidPolling
};