// logout.js
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // Clear the session
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Could not log out.');
    }
    // Clear cookies
    res.clearCookie('connect.sid'); // or whatever your session cookie name is
    res.clearCookie('other_cookie_name'); // clear any other cookies if needed
    res.send('Logged out successfully.'); // Optional: Send a success message
  });
});

module.exports = router;
