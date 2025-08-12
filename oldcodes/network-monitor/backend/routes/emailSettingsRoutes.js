// backend/routes/emailSettingsRoutes.js
const express = require('express');
const prisma = require('../prismaClient');
const { initializeEmailTransporter } = require('../services/emailService'); // Import the re-initialization function

const router = express.Router();

// Get email settings
router.get('/', async (req, res) => {
    const settings = await prisma.emailSetting.findFirst();
    // Consider redacting sensitive info (like smtpPass) before sending to frontend
    if (settings && settings.smtpPass) {
        const { smtpPass, ...safeSettings } = settings;
        res.json(safeSettings);
    } else {
        res.json(settings);
    }
});

// Save/Update email settings
router.post('/', async (req, res) => {
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, fromAddress, toAddresses } = req.body;
    try {
        // Only one email setting record is expected
        const existingSettings = await prisma.emailSetting.findFirst();
        let emailSettings;
        if (existingSettings) {
            emailSettings = await prisma.emailSetting.update({
                where: { id: existingSettings.id },
                data: { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, fromAddress, toAddresses },
            });
        } else {
            emailSettings = await prisma.emailSetting.create({
                data: { smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure, fromAddress, toAddresses },
            });
        }
        await initializeEmailTransporter(); // Reinitialize transporter on change
        // Consider redacting sensitive info before sending response
        const { smtpPass: _, ...safeSettings } = emailSettings;
        res.status(200).json(safeSettings);
    } catch (error) {
        console.error('Error saving email settings:', error);
        res.status(500).json({ error: 'Failed to save email settings.', details: error.message });
    }
});

module.exports = router;