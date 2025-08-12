const express = require('express');
const router = express.Router();
const db = require('../../models');

// Create an organization
router.post('/', async (req, res) => {
  try {
    const organization = await db.Organization.create(req.body);
    res.status(201).json(organization);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const organizations = await db.Organization.findAll({
      include: [db.Location, db.VLAN, db.Network, db.Device]
    });
    res.status(200).json(organizations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get an organization by ID
router.get('/:id', async (req, res) => {
  try {
    const organization = await db.Organization.findByPk(req.params.id, {
      include: [db.Location, db.VLAN, db.Network, db.Device]
    });
    if (organization) {
      res.status(200).json(organization);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an organization by ID
router.put('/:id', async (req, res) => {
  try {
    const organization = await db.Organization.findByPk(req.params.id);
    if (organization) {
      await organization.update(req.body);
      res.status(200).json(organization);
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an organization by ID
router.delete('/:id', async (req, res) => {
  try {
    const organization = await db.Organization.findByPk(req.params.id);
    if (organization) {
      await organization.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Organization not found' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
