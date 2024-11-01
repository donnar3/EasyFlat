// middleware/auth.js
const pool = require('../db'); 

const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    next();
  } else {
    res.status(401).send({ message: 'You are not authenticated' });
  }
};

const isVerifiedUser = async (req, res, next) => {
  if (!req.session.email) {
    return res.status(401).send({ message: 'No email found in session' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM korisnik WHERE email = $1 AND aktivan = false',
      [req.session.email]
    );

    if (result.rows.length > 0) {
      next();
    } else {
      res.status(403).send({ message: 'User is not verified or inactive' });
    }
  } catch (error) {
    console.error('Database error during email verification:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = { isAuthenticated, isVerifiedUser };
