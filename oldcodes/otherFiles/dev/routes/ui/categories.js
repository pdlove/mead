const express = require('express');
const router = express.Router();
const db = require('../../models');

// Category Routes
router.get('/', async (req, res) => {
  try {
    const categories = await db.Categories.findAll({
        order: [['parent_categoryID', 'ASC'], ['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

router.get('/:id', async (req, res) => {
  if (isNaN(req.params.id)) {
    //The ID is a string. This is assumed to be to category group we're looking for.
    const category = await db.Categories.findAll({where: { tabletype: req.params.id}});
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }

  } else {
    //the ID is a number
    const category = await db.Categories.findByPk(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  }
});

router.post('', async (req, res) => {
  const category = await db.Categories.create(req.body);
  res.status(201).json(category);
});

router.put('/:id', async (req, res) => {
  const category = await db.Categories.findByPk(req.params.id);
  if (category) {
    await category.update(req.body);
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

router.delete('/:id', async (req, res) => {
  const category = await db.Categories.findByPk(req.params.id);
  if (category) {
    await category.destroy();
    res.json({ message: 'Category deleted' });
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

module.exports = router;
