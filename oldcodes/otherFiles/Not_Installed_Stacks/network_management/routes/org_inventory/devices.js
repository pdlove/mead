const express = require('express');
const router = express.Router();
const db = require('../../../system/models');

// Create a device
router.post('/', async (req, res) => {
  try {
    const device = await db.Device.create(req.body);
    res.status(201).json(device);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await db.Device.findAll({ include: [db.DeviceInterface] });
    res.status(200).json(devices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a device by ID
router.get('/:id', async (req, res) => {
  try {
    const device = await db.Device.findByPk(req.params.id, { include: [db.DeviceInterface] });
    if (device) {
      res.status(200).json(device);
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a device by ID
router.put('/:id', async (req, res) => {
  try {
    const device = await db.Device.findByPk(req.params.id);
    if (device) {
      await device.update(req.body);
      res.status(200).json(device);
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a device by ID
router.delete('/:id', async (req, res) => {
  try {
    const device = await db.Device.findByPk(req.params.id);
    if (device) {
      await device.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Device not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
