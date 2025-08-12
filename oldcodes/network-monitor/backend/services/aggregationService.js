// backend/services/aggregationService.js
const prisma = require('../prismaClient');

let aggregationJobId;

async function aggregatePollLatencies() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const devices = await prisma.device.findMany();

    for (const device of devices) {
        const recentPolls = await prisma.pollLatency.findMany({
            where: {
                deviceId: device.id,
                timestamp: {
                    gte: fiveMinutesAgo,
                    lt: now,
                },
            },
        });

        if (recentPolls.length > 0) {
            const totalLatency = recentPolls.reduce((sum, poll) => sum + (poll.latencyMs > 0 ? poll.latencyMs : 0), 0);
            const successfulPolls = recentPolls.filter(poll => poll.latencyMs > 0).length;
            const missedPolls = recentPolls.filter(poll => poll.latencyMs === -1).length;

            const averageLatencyMs = successfulPolls > 0 ? totalLatency / successfulPolls : 0;

            await prisma.aggregatedPollLatency.create({
                data: {
                    deviceId: device.id,
                    startTime: fiveMinutesAgo,
                    endTime: now,
                    averageLatencyMs: averageLatencyMs,
                    missedPollsCount: missedPolls,
                },
            });
        }
    }
    console.log(`Aggregated poll latencies for ${devices.length} devices in the last 5 minutes.`);
}

function startAggregationJob() {
    if (!aggregationJobId) {
        // Run immediately, then every 5 minutes
        aggregatePollLatencies();
        aggregationJobId = setInterval(aggregatePollLatencies, 5 * 60 * 1000); // Run every 5 minutes
        console.log('Aggregation job started.');
    }
}

function stopAggregationJob() {
    if (aggregationJobId) {
        clearInterval(aggregationJobId);
        aggregationJobId = null;
        console.log('Aggregation job stopped.');
    }
}

module.exports = {
    startAggregationJob,
    stopAggregationJob
};