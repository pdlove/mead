// backend/services/emailService.js
const nodemailer = require('nodemailer');
const prisma = require('../prismaClient');

let transporter;
let fromAddress;

async function initializeEmailTransporter() {
    try {
        const emailSettings = await prisma.emailSetting.findFirst();
        if (emailSettings) {
            transporter = nodemailer.createTransport({
                host: emailSettings.smtpHost,
                port: emailSettings.smtpPort,
                secure: emailSettings.smtpSecure,
                auth: {
                    user: emailSettings.smtpUser,
                    pass: emailSettings.smtpPass,
                },
                tls: { // <--- ADD THIS TLS BLOCK
                    rejectUnauthorized: false // <--- THIS IS THE KEY SETTING FOR SELF-SIGNED CERTS
                }
            });
            fromAddress = emailSettings.fromAddress;
            console.log('Email transporter initialized.');
        } else {
            console.warn('Email settings not found. Email alerts will not be sent.');
            transporter = null;
        }
    } catch (error) {
        console.error('Error initializing email transporter:', error);
        transporter = null;
    }
}

async function sendEmailAlert(subject, text, toAddresses) {
    if (!transporter) {
        console.error('Email transporter not initialized. Cannot send email.');
        return;
    }
    if (!toAddresses) {
        console.error('No recipient addresses provided for email alert.');
        return;
    }
    try {
        await transporter.sendMail({
            from: fromAddress || 'noreply@device-monitor.com',
            to: toAddresses,
            subject: subject,
            text: text,
        });
        console.log(`Email sent: ${subject}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = {
    initializeEmailTransporter,
    sendEmailAlert,
};