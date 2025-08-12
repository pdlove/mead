const express = require('express');
const router = express.Router();
const { Website, User } = require('../config/database'); // Import Website and User models

// Middleware for website access authorization
const authorizeWebsiteAccess = async (req, res, next) => {
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

        if (actingUser.role === 'website_admin') {
            // If accessing a specific website (PUT/DELETE), check if assigned
            if (req.params.id) {
                const website = await Website.findByPk(req.params.id);
                if (!website || !actingUser.assignedWebsites.includes(website.id)) {
                    return res.status(403).json({ message: 'Forbidden: You are not assigned to this website.' });
                }
            }
            // For GET and POST (creating new), website_admin can manage their own data
            req.targetUserId = actingUser.id; // Website admin can only manage their own websites
            return next();
        }

        return res.status(403).json({ message: 'Forbidden: You do not have permission to manage websites.' });

    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ message: 'Internal server error during authorization.' });
    }
};

// GET all websites for a specific user
router.get('/websites', authorizeWebsiteAccess, async (req, res) => {
    try {
        const userId = req.headers['x-acting-user-id'] || req.params.userId;
        const websites = await Website.findAll({ where: { userId } });
        res.status(200).json(websites);
    } catch (error) {
        console.error('Error fetching websites:', error);
        res.status(500).json({ message: 'Error fetching websites', error: error.message });
    }
});

// GET a single website by ID for a specific user
router.get('/websites/:id', authorizeWebsiteAccess, async (req, res) => {
    try {
        const userId = req.headers['x-acting-user-id'] || req.params.userId;
        const website = await Website.findOne({
            where: {
                id: req.params.id,
                userId
            }
        });
        if (website) {
            res.status(200).json(website);
        } else {
            res.status(404).json({ message: 'Website not found' });
        }
    } catch (error) {
        console.error('Error fetching website:', error);
        res.status(500).json({ message: 'Error fetching website', error: error.message });
    }
});

// POST a new website for a specific user
router.post('/websites', authorizeWebsiteAccess, async (req, res) => {
    const {
        domain, type, docRoot, clusterId, port, phpTemplate, phpVersion, phpModules,
        sslType, customSslCertPath, customSslKeyPath, githubUrl, githubUsername,
        githubAuthType, githubPassword, githubSshCert, githubSshCertInstalledDate,
        webhookEnabled, webhookUrl, webhookSecret
    } = req.body;
    const userId = req.headers['x-acting-user-id'] || req.params.userId;        

    try {
        const newWebsite = await Website.create({
            domain, type, docRoot, clusterId, port, phpTemplate, phpVersion, phpModules,
            sslType, customSslCertPath, customSslKeyPath, githubUrl, githubUsername,
            githubAuthType, githubPassword, githubSshCert, githubSshCertInstalledDate,
            webhookEnabled, webhookUrl, webhookSecret,
            userId // Assign the website to the user
        });
        res.status(201).json(newWebsite);
    } catch (error) {
        console.error('Error creating website:', error);
        res.status(500).json({ message: 'Error creating website', error: error.message });
    }
});

// PUT (update) an existing website for a specific user
router.put('/websites/:id', authorizeWebsiteAccess, async (req, res) => {
    const userId = req.headers['x-acting-user-id'] || req.params.userId;
    const { id } = req.params;
    const {
        domain, type, docRoot, clusterId, port, phpTemplate, phpVersion, phpModules,
        sslType, customSslCertPath, customSslKeyPath, githubUrl, githubUsername,
        githubAuthType, githubPassword, githubSshCert, githubSshCertInstalledDate,
        webhookEnabled, webhookUrl, webhookSecret
    } = req.body;

    try {
        const website = await Website.findOne({
            where: {
                id: id,
                userId: userId
            }
        });

        if (website) {
            website.domain = domain;
            website.type = type;
            website.docRoot = docRoot;
            website.clusterId = clusterId;
            website.port = port;
            website.phpTemplate = phpTemplate;
            website.phpVersion = phpVersion;
            website.phpModules = phpModules;
            website.sslType = sslType;
            website.customSslCertPath = customSslCertPath;
            website.customSslKeyPath = customSslKeyPath;
            website.githubUrl = githubUrl;
            website.githubUsername = githubUsername;
            website.githubAuthType = githubAuthType;
            website.githubPassword = githubPassword; // Remember: insecure without hashing
            website.githubSshCert = githubSshCert; // Remember: insecure without proper management
            website.githubSshCertInstalledDate = githubSshCertInstalledDate;
            website.webhookEnabled = webhookEnabled;
            website.webhookUrl = webhookUrl;
            website.webhookSecret = webhookSecret; // Remember: insecure without proper management

            await website.save();
            res.status(200).json(website);
        } else {
            res.status(404).json({ message: 'Website not found or not owned by user' });
        }
    } catch (error) {
        console.error('Error updating website:', error);
        res.status(500).json({ message: 'Error updating website', error: error.message });
    }
});

// DELETE a website for a specific user
router.delete('/websites/:id', authorizeWebsiteAccess, async (req, res) => {
    const { id } = req.params;
    const userId = req.headers['x-acting-user-id'] || req.params.userId;    
    try {
        const result = await Website.destroy({
            where: {
                id: id,
                userId: userId
            }
        });
        if (result > 0) {
            res.status(200).json({ message: 'Website deleted successfully' });
        } else {
            res.status(404).json({ message: 'Website not found or not owned by user' });
        }
    } catch (error) {
        console.error('Error deleting website:', error);
        res.status(500).json({ message: 'Error deleting website', error: error.message });
    }
});

module.exports = router;