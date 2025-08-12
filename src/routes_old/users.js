const express = require('express');
const router = express.Router();
const { User, Cluster, Website } = require('../config/database'); // Import models
const { v4: uuidv4 } = require('uuid'); // For generating new user IDs if needed

// Middleware to check if user is site_admin (simplified for demo)
const authorizeSiteAdmin = async (req, res, next) => {
    // In a real app, this would involve validating a JWT token
    // and extracting user ID and role from it.
    // For this demo, we assume userId is passed in the URL for data fetching,
    // but for admin actions, we'll check the role of the *acting* user.
    // For simplicity, we'll assume the frontend's `userId` is the acting user for now.
    const actingUserId = req.headers['x-acting-user-id'] || req.params.userId;
         // Get acting user ID

    if (!actingUserId) {
        return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
        const actingUser = await User.findByPk(actingUserId);
        if (!actingUser || actingUser.role !== 'site_admin') {
            return res.status(403).json({ message: 'Forbidden: Only Site Admins can perform this action.' });
        }
        req.actingUser = actingUser; // Attach acting user to request
        next();
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error during authorization.' });
    }
};

// GET all users (only for site_admin)
router.get('/users', async (req, res) => {
    // In a real app, you'd pass the acting user's ID in headers or params
    // For this demo, we'll just allow it if the frontend identifies as admin
    // This endpoint is meant for the UserManagement component which is only visible to site_admin.
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] } // Never send passwords
        });
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// GET a single user by ID (for fetching roles/assignments)
router.get('/users/:userId', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: { exclude: ['password'] }
        });
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});


// PUT (update) or POST (create if not exists) a user's role and assignments
// The frontend sends userId in the URL for the user being managed, and the actingUserId for authorization.
router.put('/users/:targetUserId', authorizeSiteAdmin, async (req, res) => {
    const { targetUserId } = req.params;
    const { role, assignedClusters, assignedWebsites } = req.body;

    try {
        let user = await User.findByPk(targetUserId);

        if (!user) {
            // If user doesn't exist, create a new one (simplified, no password for new user here)
            // In a real app, new user creation would be part of a proper registration flow.
            user = await User.create({
                id: targetUserId,
                username: `user_${targetUserId}`, // Placeholder username
                password: 'default_password', // Placeholder password, MUST be handled securely
                role,
                assignedClusters: JSON.stringify(assignedClusters || []),
                assignedWebsites: JSON.stringify(assignedWebsites || [])
            });
            return res.status(201).json({ message: 'User created and role assigned successfully', user });
        }

        // Update existing user
        user.role = role;
        user.assignedClusters = JSON.stringify(assignedClusters || []);
        user.assignedWebsites = JSON.stringify(assignedWebsites || []);
        await user.save();

        res.status(200).json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

// DELETE a user
router.delete('/users/:targetUserId', authorizeSiteAdmin, async (req, res) => {
    const { targetUserId } = req.params;

    if (targetUserId === req.actingUser.id) {
        return res.status(403).json({ message: 'You cannot delete your own user account.' });
    }

    try {
        const result = await User.destroy({ where: { id: targetUserId } });
        if (result > 0) {
            res.status(200).json({ message: 'User deleted successfully' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

module.exports = router;