const express = require('express');
const router = express.Router();
const db = require('../../models');

// Create a device interface
router.post('/', async (req, res) => {
  try {
    const deviceInterface = await db.DeviceInterface.create(req.body);
    res.status(201).json(deviceInterface);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all device interfaces
router.get('/', async (req, res) => {
  try {
    const deviceInterfaces = await db.DeviceInterface.findAll({
      include: [{
        model: db.Device,
        as: 'ConnectedTo',
        through: {
          attributes: ['foundBy']
        }
      }]
    });
    res.status(200).json(deviceInterfaces);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a device interface by ID
router.get('/:id', async (req, res) => {
  try {
    const deviceInterface = await db.DeviceInterface.findByPk(req.params.id, {
      include: [{
        model: db.Device,
        as: 'ConnectedTo',
        through: {
          attributes: ['foundBy']
        }
      }]
    });
    if (deviceInterface) {
      res.status(200).json(deviceInterface);
    } else {
      res.status(404).json({ error: 'Device Interface not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a device interface by ID
router.put('/:id', async (req, res) => {
  try {
    const deviceInterface = await db.DeviceInterface.findByPk(req.params.id);
    if (deviceInterface) {
      await deviceInterface.update(req.body);
      res.status(200).json(deviceInterface);
    } else {
      res.status(404).json({ error: 'Device Interface not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a device interface by ID
router.delete('/:id', async (req, res) => {
  try {
    const deviceInterface = await db.DeviceInterface.findByPk(req.params.id);
    if (deviceInterface) {
      await deviceInterface.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Device Interface not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
