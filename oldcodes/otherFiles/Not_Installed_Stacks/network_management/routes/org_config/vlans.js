const express = require('express');
const router = express.Router();
const db = require('../../models');

// Create a VLAN
router.post('/', async (req, res) => {
  try {
    const vlan = await db.VLAN.create(req.body);
    res.status(201).json(vlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all VLANs
router.get('/', async (req, res) => {
  try {
    const vlans = await db.VLAN.findAll({ include: [db.Network] });
    res.status(200).json(vlans);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a VLAN by ID
router.get('/:id', async (req, res) => {
  try {
    const vlan = await db.VLAN.findByPk(req.params.id, {
      include: [db.Network]
    });
    if (vlan) {
      res.status(200).json(vlan);
    } else {
      res.status(404).json({ error: 'VLAN not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a VLAN by ID
router.put('/:id', async (req, res) => {
  try {
    const vlan = await db.VLAN.findByPk(req.params.id);
    if (vlan) {
      await vlan.update(req.body);
      res.status(200).json(vlan);
    } else {
      res.status(404).json({ error: 'VLAN not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a VLAN by ID
router.delete('/:id', async (req, res) => {
  try {
    const vlan = await db.VLAN.findByPk(req.params.id);
    if (vlan) {
      await vlan.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'VLAN not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
