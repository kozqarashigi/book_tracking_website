const express = require("express");
const router = express.Router();
const { getUserProfile } = require("../controllers/userController"); // Import the controller
const protect = require("../middleware/authMiddleware"); // Import the middleware to protect routes

// Define the profile route (Private Route - requires token)
router.get("/profile", protect, getUserProfile);

module.exports = router;
