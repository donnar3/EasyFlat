const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import your database connection

router.get('/', async (req, res) => {
  console.log("Checking authentication:");
  console.log(req.session.userId);

  // Check if userId exists in session
  if (req.session.userId) {
    // If userId exists, check if email is present in the session
    if (!req.session.email) {
      return res.status(401).json({ isAuthenticated: true, isEmailVerified: false, message: 'Email not found in session.' });
    }

    try {
      // Query the database to check if the email is active
      const result = await pool.query(
        'SELECT * FROM korisnik WHERE email = $1 AND aktivan = true',
        [req.session.email]
      );

      if (result.rows.length > 0) {
        // Email exists and is active
        return res.json({ isAuthenticated: true, isEmailVerified: true });
      } else {
        // Email does not exist or is not active
        return res.json({ isAuthenticated: true, isEmailVerified: false });
      }
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // If userId does not exist, user is not authenticated
    return res.json({ isAuthenticated: false, isEmailVerified: false });
  }
});

module.exports = router;
