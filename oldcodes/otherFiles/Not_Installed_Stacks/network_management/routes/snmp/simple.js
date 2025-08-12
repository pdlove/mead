const express = require('express');
const router = express.Router();
const db = require('../../../system/models');

// Get a VLAN by ID
router.get('/:ip/:community/:snmpTable', async (req, res) => {
    try {
        const job = await db.Job.findByPk(req.params.id);
        if (job) {
            res.status(200).json(job);
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});