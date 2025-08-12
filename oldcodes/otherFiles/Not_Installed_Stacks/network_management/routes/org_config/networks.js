const express = require('express');
const router = express.Router();
const db = require('../../models');

// Create a network
router.post('/', async (req, res) => {
  try {
    const network = await db.Network.create(req.body);
    res.status(201).json(network);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all networks
router.get('/', async (req, res) => {
  try {
    const networks = await db.Network.findAll();
    res.status(200).json(networks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a network by ID
router.get('/:id', async (req, res) => {
  try {
    const network = await db.Network.findByPk(req.params.id);
    if (network) {
      res.status(200).json(network);
    } else {
      res.status(404).json({ error: 'Network not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a network by ID
router.put('/:id', async (req, res) => {
  try {
    const network = await db.Network.findByPk(req.params.id);
    if (network) {
      await network.update(req.body);
      res.status(200).json(network);
    } else {
      res.status(404).json({ error: 'Network not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a network by ID
router.delete('/:id', async (req, res) => {
  try {
    const network = await db.Network.findByPk(req.params.id);
    if (network) {
      await network.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Network not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
