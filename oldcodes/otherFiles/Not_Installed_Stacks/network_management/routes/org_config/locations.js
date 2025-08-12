const express = require('express');
const router = express.Router();
const db = require('../../../system/models');

// Create a location
router.post('/', async (req, res) => {
  try {
    const location = await db.Location.create(req.body);
    res.status(201).json(location);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all locations
router.get('/', async (req, res) => {
  try {
    const locations = await db.Location.findAll({ include: [db.Network] });
    res.status(200).json(locations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a location by ID
router.get('/:id', async (req, res) => {
  try {
    const location = await db.Location.findByPk(req.params.id, {
      include: [db.Network]
    });
    if (location) {
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a location by ID
router.put('/:id', async (req, res) => {
  try {
    const location = await db.Location.findByPk(req.params.id);
    if (location) {
      await location.update(req.body);
      res.status(200).json(location);
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a location by ID
router.delete('/:id', async (req, res) => {
  try {
    const location = await db.Location.findByPk(req.params.id);
    if (location) {
      await location.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Location not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
