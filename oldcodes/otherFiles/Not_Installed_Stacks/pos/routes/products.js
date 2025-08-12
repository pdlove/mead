const express = require('express');
const router = express.Router();
const db = require('../../../node-webframework/stacks/system/models');

// Product Routes
router.get('/', async (req, res) => {
  const products = await db.Products.findAll();
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await db.Products.findByPk(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.post('', async (req, res) => {
  const product = await db.Products.create(req.body);
  res.status(201).json(product);
});

router.put('/:id', async (req, res) => {
  const product = await db.Products.findByPk(req.params.id);
  if (product) {
    await product.update(req.body);
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const product = await db.Products.findByPk(req.params.id);
  if (product) {
    await product.destroy();
    res.json({ message: 'Product deleted' });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

module.exports = router;
