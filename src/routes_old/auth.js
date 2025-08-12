const express = require('express');
const router = express.Router();
const { User } = require('../config/database'); // Import User model

// Simulated login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });

        // In a real app, you'd hash passwords and compare securely
        if (user && user.password === password) {
            // Simulated successful login
            res.status(200).json({
                message: 'Login successful',
                userId: user.id,
                role: user.role,
                // In a real app, you'd generate a JWT token here
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error during login' });
    }
});

module.exports = router;