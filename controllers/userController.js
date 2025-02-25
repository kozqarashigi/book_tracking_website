const asyncHandler = require("express-async-handler");

// Dummy profile data - Replace this with actual DB logic later
const getUserProfile = asyncHandler(async (req, res) => {
    res.json({
        message: "User profile retrieved successfully",
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email
        }
    });
});

// Export the function
module.exports = { getUserProfile };
