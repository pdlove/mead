const express = require('express');
const router = express.Router();
const db = require('../../models');

// Create a Job
router.post('/', async (req, res) => {
    try {
        const job = await db.Job.create(req.body);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all VLANs
router.get('/', async (req, res) => {
    try {
        const jobs = await db.Job.findAll();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get a VLAN by ID
router.get('/:id', async (req, res) => {
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

// Get a VLAN by Status
router.get('/status/:status', async (req, res) => {
    try {
        const job = await db.Job.findAll({where: { status: req.params.status.split(",")}});
        if (job) {
            res.status(200).json(job);
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update a VLAN by ID
router.put('/:id', async (req, res) => {
    try {
        const job = await db.Job.findByPk(req.params.id);
        if (job) {
            await job.update(req.body);
            res.status(200).json(job);
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a VLAN by ID
router.delete('/:id', async (req, res) => {
    try {
        const job = await db.Job.findByPk(req.params.id);
        if (job) {
            await job.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Job not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
