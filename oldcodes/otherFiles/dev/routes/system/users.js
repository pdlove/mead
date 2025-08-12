const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../../node-webframework/stacks/system/models'); // Assuming your models are in a 'models' folder

const router = express.Router();

// Middleware to authenticate and check if user is admin
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token after "Bearer"

  if (token) {
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Get all users
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a single user
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { username, email, password, totp_key, locked } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.User.create({
      username,
      email,
      password: hashedPassword,
      totp_key,
      locked,
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Edit a user
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { username, email, password, totp_key, locked } = req.body;
    const user = await db.User.findByPk(req.params.id);
    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      user.totp_key = totp_key || user.totp_key;
      user.locked = locked !== undefined ? locked : user.locked;
      await user.save();
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Logon route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.User.findOne({ where: { username } });

  if (user && await bcrypt.compare(password, user.password)) {
    const accessToken = jwt.sign({ username: user.username, id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ accessToken });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

module.exports = router;
