const validator = require('validator');

const validateRegister = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !validator.isLength(username, { min: 3, max: 30 })) {
        return res.status(400).json({ message: 'Username must be between 3 and 30 characters' });
    }

    if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!password || !validator.isLength(password, { min: 6 })) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    next();
};

module.exports = { validateRegister };
