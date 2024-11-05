// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

// Function to get user data from session
const getUserData = (session) => {
    console.log("Njegov stanID je: ", session.stanBr);
    return {
        slika: session.picture,  // Assuming the image URL is stored in the session
        ime: session.ime + ' ' + session.prezime,
        status: session.status || 'Suvlasnik',  // Default to 'Suvlasnik' if not provided
        email: session.email,
        stanBr: session.stanBr
    };
};

// Route to post user info
router.post('/', (req, res) => {
    console.log("Fetching user data...");
    try {
        const userId = req.session.userId;  // Assuming userId is in session
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        const userData = getUserData(req.session);
        res.json(userData);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
