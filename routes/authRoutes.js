const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// Register User
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);
  
    // Validate inputs
    if (!username || !email || !password) {
      return res.render('register', { error: 'All fields are required' });
    }
  
    if (password.length < 6) {
      return res.render('register', { error: 'Password must be at least 6 characters long' });
    }
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.render('register', { error: 'Email is already registered' });
      }

      const newUser = new User({ username, email, password, role: 'user' });
      await newUser.save();

      res.redirect('/login');
    } catch (err) {
      console.error('Registration error:', err);
      res.render('register', { error: 'Error registering user' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    // Validate email and password
    if (!email || !password) {
      return res.render('login', { error: 'Email and password are required' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      // If the user is not found
      if (!user) {
        return res.render('login', { error: 'Unregistered email' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      console.log(isMatch);
      if (!isMatch) {
        return res.render('login', { error: 'Incorrect password' });
      }

      // Save session
      req.session.user = { id: user._id, username: user.username, role: user.role };
      res.redirect('/dashboard');
    } catch (err) {
      res.render('login', { error: 'Error logging in' });
    }
  });

// Logout
router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

module.exports = router;
