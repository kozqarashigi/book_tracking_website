const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Book = require('../models/Book');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile and reading statistics
 * @access  Private
 */
router.get('/profile', protect, async (req, res) => {
    try {
        // Get user data without password
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        // Send response
        res.json({
            user
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            error: 'Server error while fetching profile' 
        });
    }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile information
 * @access  Private
 */
router.put('/profile', protect, async (req, res) => {
    try {
        const { username, email } = req.body;

        // Validate input
        if (!username || !email) {
            return res.status(400).json({ 
                error: 'Username and email are required' 
            });
        }

        // Check if email is already in use by another user
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: req.user.id } 
        });
        
        if (existingUser) {
            return res.status(400).json({ 
                error: 'Email is already in use' 
            });
        }

        // Update user profile
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $set: { 
                    username,
                    email,
                    updatedAt: Date.now()
                }
            },
            { 
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        res.json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile update error:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                error: 'Invalid input data',
                details: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({ 
            error: 'Server error while updating profile' 
        });
    }
});

module.exports = router;