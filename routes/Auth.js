// Auth.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust path as necessary
const { JWT_SECRET } = require('../config/keys');

// Registration Endpoint
router.post('/register', async (req, res) => {
  let { username, email, password } = req.body;

  // Convert email and username to lowercase for consistency
  email = email.toLowerCase();
  username = username.toLowerCase();

  try {
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ msg: "Email or username already exists" });
    }

    user = new User({
      username,
      email,
      password
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, JWT_SECRET, {
      expiresIn: 360000
    }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    // Find user by case-insensitive search for either username or email
    let user = await User.findOne({
      $or: [
        { email: { $regex: new RegExp("^" + identifier.toLowerCase(), "i") } }, 
        { username: { $regex: new RegExp("^" + identifier.toLowerCase(), "i") } }
      ]
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token, username: user.username });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
