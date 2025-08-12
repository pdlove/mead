// backend/routes/categoryRoutes.js
const express = require('express');
const prisma = require('../prismaClient');
const { initializeAllDevicePolling } = require('../services/pollingService'); // Need to re-init polling if category changes

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
    const categories = await prisma.deviceCategory.findMany();
    res.json(categories);
});

// Create new category
router.post('/', async (req, res) => {
    const { name, notifyDownPolls, notifyUpPolls, pollInterval } = req.body;
    try {
        const newCategory = await prisma.deviceCategory.create({
            data: { name, notifyDownPolls, notifyUpPolls, pollInterval, nextPoll: new Date(), lastPoll: new Date() },
        });
        // Reinitialize all polling if a category changes that might affect devices
        await initializeAllDevicePolling();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Failed to add category.', details: error.message });
    }
});

// Update category
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, notifyDownPolls, notifyUpPolls, pollInterval } = req.body;
    try {
        const updatedCategory = await prisma.deviceCategory.update({
            where: { id },
            data: { name, notifyDownPolls, notifyUpPolls, pollInterval },
        });
        // Reinitialize all polling if a category changes that might affect devices
        await initializeAllDevicePolling();
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category.', details: error.message });
    }
});

// Delete category
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Prevent deletion if devices are still linked to this category
        const devicesInCategory = await prisma.device.count({ where: { deviceCategoryId: id } });
        if (devicesInCategory > 0) {
            return res.status(400).json({ error: 'Cannot delete category with associated devices. Please reassign devices first.' });
        }
        await prisma.deviceCategory.delete({ where: { id } });
        // No need to reinitialize polling here as no devices will be affected by a deleted category
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category.', details: error.message });
    }
});

module.exports = router;