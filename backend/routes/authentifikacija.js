const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized: You must log in first.' });
}

router.get('/', isAuthenticated, (req, res) => {
    // autentifikacija
    res.json({
        message: 'This is protected data',
        user: {
            userId: req.session.userId,
            userName: req.session.userName,
            picture: req.session.picture
        } // Send the user info stored in the session
    });
});

// Export the router
module.exports = router;
