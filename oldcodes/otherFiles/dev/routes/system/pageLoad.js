const express = require('express');
const router = express.Router();

// Get all devices
router.get('/', async (req, res) => {
  try {
    const devices = await db.Device.findAll({ include: [db.DeviceInterface] });
    res.status(200).json(devices);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
