// backend/server.js
const express = require('express');
const path = require('path');
const cors = require('cors'); // For development, if frontend is on different port

const prisma = require('./prismaClient'); // Centralized Prisma client
const defaultCategories = require('./config/defaultCategories'); // Default categories config

const { initializeEmailTransporter } = require('./services/emailService');
const { startPingScheduler, stopPingScheduler } = require('./services/pingScheduler'); // Import the ping scheduler service
const { startAggregationJob } = require('./services/aggregationService');

const deviceRoutes = require('./routes/deviceRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const emailSettingsRoutes = require('./routes/emailSettingsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); // Enable CORS for development (adjust for production)

// Route Mounting
app.use('/api/devices', deviceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/email-settings', emailSettingsRoutes);

// Serve static React files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

// Initialize Default Categories
async function initializeDefaultCategories() {
    for (const cat of defaultCategories) {
        await prisma.deviceCategory.upsert({
            where: { name: cat.name },
            update: cat,
            create: cat,
        });
    }
    console.log('Default categories initialized.');
}

// Start the server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await initializeDefaultCategories();
        await initializeEmailTransporter();
        startPingScheduler(); // Start polling for all existing devices on startup
        startAggregationJob(); // Start the 5-minute aggregation job
    } catch (error) {
        console.error('Failed to initialize application:', error);
        process.exit(1); // Exit if critical initialization fails
    }
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received. Shutting down gracefully.');
    stopPingScheduler(); // Stop the scheduler
     await prisma.$disconnect();
   
    process.exit(0);
});

// Graceful shutdown
process.on('SIGINT', async () =>{
    console.log('SIGINT signal received. Shutting down gracefully.');
    stopPingScheduler(); // Stop the scheduler
    await prisma.$disconnect();   
    process.exit(0);
});