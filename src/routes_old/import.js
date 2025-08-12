const express = require('express');
const router = express.Router();
const { Server, Cluster, Website, User, sequelize } = require('../config/database'); // Import all models and sequelize

// Middleware to authorize import (only site_admin can import data)
const authorizeImport = async (req, res, next) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;  // The user attempting the import
    // In a real app, you'd validate a JWT token here to get the actual acting user.
    // For this demo, we'll assume the userId in the URL is the acting user.
    try {
        const actingUser = await User.findByPk(userId);
        if (!actingUser || actingUser.role !== 'site_admin') {
            return res.status(403).json({ message: 'Forbidden: Only Site Admins can perform import operations.' });
        }
        next();
    } catch (error) {
        console.error('Authorization error for import:', error);
        res.status(500).json({ message: 'Internal server error during import authorization.' });
    }
};

// POST endpoint for importing data
router.post('/import', authorizeImport, async (req, res) => {
    const { servers, clusters, websites, users } = req.body;
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
        

    const t = await sequelize.transaction(); // Start a transaction for atomicity

    try {
        // 1. Delete existing data for the target user (or all data if it's a global import)
        // For this user-scoped import, we delete data owned by `userId`.
        await Server.destroy({ where: { userId: userId }, transaction: t });
        await Cluster.destroy({ where: { userId: userId }, transaction: t });
        await Website.destroy({ where: { userId: userId }, transaction: t });

        // IMPORTANT: User roles are managed globally or by a site_admin.
        // If the import includes 'users' data, decide carefully if it should overwrite
        // existing user roles or only create new ones. For this demo, we'll
        // upsert (create or update) users based on the imported data.
        if (users && users.length > 0) {
            for (const userData of users) {
                // Exclude password from direct update if it's not provided or should be handled separately
                const { id, username, password, role, assignedClusters, assignedWebsites } = userData;
                await User.upsert({
                    id,
                    username,
                    password: password || 'default_password', // Provide a default or handle securely
                    role,
                    assignedClusters: assignedClusters || [],
                    assignedWebsites: assignedWebsites || []
                }, { transaction: t });
            }
        }


        // 2. Insert new data
        // Ensure new data is associated with the correct userId
        if (servers && servers.length > 0) {
            const serversToCreate = servers.map(s => ({ ...s, userId: userId }));
            await Server.bulkCreate(serversToCreate, { transaction: t });
        }
        if (clusters && clusters.length > 0) {
            const clustersToCreate = clusters.map(c => ({ ...c, userId: userId }));
            await Cluster.bulkCreate(clustersToCreate, { transaction: t });
        }
        if (websites && websites.length > 0) {
            const websitesToCreate = websites.map(w => ({ ...w, userId: userId }));
            await Website.bulkCreate(websitesToCreate, { transaction: t });
        }

        await t.commit(); // Commit the transaction if all operations succeed
        res.status(200).json({ message: 'Data imported successfully!' });

    } catch (error) {
        await t.rollback(); // Rollback the transaction if any operation fails
        console.error('Error during data import:', error);
        res.status(500).json({ message: 'Failed to import data', error: error.message });
    }
});

module.exports = router;