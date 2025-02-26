const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { validateRegister } = require('../middleware/validator');
const router = express.Router();

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    });
};

// Register User
router.post('/register', validateRegister, async (req, res) => {
    const { username, email, password } = req.body;
    
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered' });
        }

        const newUser = new User({ username, email, password, role: 'user' });
        await newUser.save();

        // Generate token
        const token = generateToken(newUser._id);
        
        res.status(201).json({
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role,
            token
        });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Validate email and password
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    
    try {
        const user = await User.findOne({ email });
        
        // If the user is not found
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user._id);
        
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;