const express = require('express');
const router = express.Router();
const { Server, User } = require('../config/database'); // Import Server and User models

// Middleware to check user permissions for server management
const authorizeServerAccess = async (req, res, next) => {
    const { userId } = req.params; // The user whose data is being accessed
    const actingUserId = req.headers['x-acting-user-id'] || userId; // In a real app, get this from JWT

    try {
        const actingUser = await User.findByPk(actingUserId);
        if (!actingUser) {
            return res.status(401).json({ message: 'Authentication required.' });
        }

        // Site admin can manage all servers
        if (actingUser.role === 'site_admin') {
            req.targetUserId = userId; // Set targetUserId for the route handler
            return next();
        }

        // No other roles are currently defined to manage servers
        return res.status(403).json({ message: 'Forbidden: You do not have permission to manage servers.' });

    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error during authorization.' });
    }
};

// GET all servers for a specific user
router.get('/servers', authorizeServerAccess, async (req, res) => {
    try {
        const userId = req.headers['x-acting-user-id'] || req.params.userId;
        const servers = await Server.findAll({ where: { userId: userId } });
        res.status(200).json(servers);
    } catch (error) {
        console.error('Error fetching servers:', error);
        res.status(500).json({ message: 'Error fetching servers', error: error.message });
    }
});

// GET a single server by ID for a specific user
router.get('/servers/:id', authorizeServerAccess, async (req, res) => {
    try {
        const userId = req.headers['x-acting-user-id'] || req.params.userId;
        const server = await Server.findOne({
            where: {
                id: req.params.id,
                userId: userId
            }
        });
        if (server) {
            res.status(200).json(server);
        } else {
            res.status(404).json({ message: 'Server not found' });
        }
    } catch (error) {
        console.error('Error fetching server:', error);
        res.status(500).json({ message: 'Error fetching server', error: error.message });
    }
});

// POST a new server for a specific user
router.post('/servers/', authorizeServerAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
    const { name, ip, role, sshUser, sshKey } = req.body;
    
    try {
        const newServer = await Server.create({
            name,
            ip,
            role,
            sshUser,
            sshKey,
            userId // Assign the server to the user
        });
        res.status(201).json(newServer);
    } catch (error) {
        console.error('Error creating server:', error);
        res.status(500).json({ message: 'Error creating server', error: error.message });
    }
});

// PUT (update) an existing server for a specific user
router.put('/servers/:id', authorizeServerAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
    const { id } = req.params;
    const { name, ip, role, sshUser, sshKey } = req.body;

    try {
        const server = await Server.findOne({
            where: {
                id: id,
                userId: userId
            }
        });

        if (server) {
            server.name = name;
            server.ip = ip;
            server.role = role;
            server.sshUser = sshUser;
            server.sshKey = sshKey;
            await server.save();
            res.status(200).json(server);
        } else {
            res.status(404).json({ message: 'Server not found or not owned by user' });
        }
    } catch (error) {
        console.error('Error updating server:', error);
        res.status(500).json({ message: 'Error updating server', error: error.message });
    }
});

// DELETE a server for a specific user
router.delete('/servers/:id', authorizeServerAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
    const { id } = req.params;

    try {
        const result = await Server.destroy({
            where: {
                id: id,
                userId: userId
            }
        });
        if (result > 0) {
            res.status(200).json({ message: 'Server deleted successfully' });
        } else {
            res.status(404).json({ message: 'Server not found or not owned by user' });
        }
    } catch (error) {
        console.error('Error deleting server:', error);
        res.status(500).json({ message: 'Error deleting server', error: error.message });
    }
});

module.exports = router;