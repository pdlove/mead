const express = require('express');
const router = express.Router();
const { Cluster, User } = require('../config/database'); // Import Cluster and User models

// Middleware for cluster access authorization
const authorizeClusterAccess = async (req, res, next) => {
    const { userId } = req.params; // The user whose data is being accessed
    const actingUserId = req.headers['x-acting-user-id'] || userId; // In a real app, get this from JWT

    try {
        const actingUser = await User.findByPk(actingUserId);
        if (!actingUser) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        if (actingUser.role === 'site_admin') {
            req.targetUserId = userId;
            return next();
        }

        if (actingUser.role === 'cluster_admin') {
            // Check if the acting user is assigned to this specific cluster (for PUT/DELETE)
            if (req.params.id) {
                const cluster = await Cluster.findByPk(req.params.id);
                if (!cluster || !actingUser.assignedClusters.includes(cluster.id)) {
                    return res.status(403).json({ message: 'Forbidden: You are not assigned to this cluster.' });
                }
            }
            // For GET and POST (creating new), cluster_admin can manage their own data
            req.targetUserId = actingUser.id; // Cluster admin can only manage their own clusters
            return next();
        }

        return res.status(403).json({ message: 'Forbidden: You do not have permission to manage clusters.' });

    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error during authorization.' });
    }
};

// GET all clusters for a specific user
router.get('/clusters/', authorizeClusterAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;        
    try {
        const clusters = await Cluster.findAll({ where: { userId } });
        res.status(200).json(clusters);
    } catch (error) {
        console.error('Error fetching clusters:', error);
        res.status(500).json({ message: 'Error fetching clusters', error: error.message });
    }
});

// GET a single cluster by ID for a specific user
router.get('/clusters/:id', authorizeClusterAccess, async (req, res) => {
    try {
        const userId = req.headers['x-acting-user-id'] || req.params.userId;
        const cluster = await Cluster.findOne({
            where: {
                id: req.params.id,
                userId
            }
        });
        if (cluster) {
            res.status(200).json(cluster);
        } else {
            res.status(404).json({ message: 'Cluster not found' });
        }
    } catch (error) {
        console.error('Error fetching cluster:', error);
        res.status(500).json({ message: 'Error fetching cluster', error: error.message });
    }
});

// POST a new cluster for a specific user
router.post('/clusters/', authorizeClusterAccess, async (req, res) => {
    const { name, sharedIp, serverIds } = req.body;
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
        

    try {
        const newCluster = await Cluster.create({
            name,
            sharedIp,
            serverIds,
            userId // Assign the cluster to the user
        });
        res.status(201).json(newCluster);
    } catch (error) {
        console.error('Error creating cluster:', error);
        res.status(500).json({ message: 'Error creating cluster', error: error.message });
    }
});

// PUT (update) an existing cluster for a specific user
router.put('/clusters/:id', authorizeClusterAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
    const { id } = req.params;
    const { name, sharedIp, serverIds } = req.body;

    try {
        const cluster = await Cluster.findOne({
            where: {
                id: id,
                userId: userId
            }
        });

        if (cluster) {
            cluster.name = name;
            cluster.sharedIp = sharedIp;
            cluster.serverIds = serverIds;
            await cluster.save();
            res.status(200).json(cluster);
        } else {
            res.status(404).json({ message: 'Cluster not found or not owned by user' });
        }
    } catch (error) {
        console.error('Error updating cluster:', error);
        res.status(500).json({ message: 'Error updating cluster', error: error.message });
    }
});

// DELETE a cluster for a specific user
router.delete('/clusters/:id', authorizeClusterAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
    const { id, } = req.params;

    try {
        const result = await Cluster.destroy({
            where: {
                id: id,
                userId: userId
            }
        });
        if (result > 0) {
            res.status(200).json({ message: 'Cluster deleted successfully' });
        } else {
            res.status(404).json({ message: 'Cluster not found or not owned by user' });
        }
    } catch (error) {
        console.error('Error deleting cluster:', error);
        res.status(500).json({ message: 'Error deleting cluster', error: error.message });
    }
});

module.exports = router;