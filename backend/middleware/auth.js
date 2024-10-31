// middleware/auth.js
const pool = require('../db'); // Import your database pool

// Checks if there is a session (user is logged in)
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send({ message: 'You are not authenticated' });
  }
};

// Checks if the email in session exists and is active in the database
const isVerifiedUser = async (req, res, next) => {
  if (!req.session.email) {
    return res.status(401).send({ message: 'No email found in session' });
  }

  try {
    // Query the database to check if the user with this email exists and is active
    const result = await pool.query(
      'SELECT * FROM korisnik WHERE email = $1 AND aktivan = false',
      [req.session.email]
    );

    if (result.rows.length > 0) {
      // User exists and is active, proceed to the next middleware or route
      next();
    } else {
      // User does not exist or is not active
      res.status(403).send({ message: 'User is not verified or inactive' });
    }
  } catch (error) {
    console.error('Database error during email verification:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { isAuthenticated, isVerifiedUser };
