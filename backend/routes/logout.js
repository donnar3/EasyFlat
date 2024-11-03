// routes/LogoutRoutes.js
const express = require('express');

class LogoutRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  // Method to handle logout
  handleLogout(req, res) {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).send('Could not log out.');
      }
      // Clear session cookie
      res.clearCookie('connect.sid'); // Adjust if using a custom session cookie name
      // Clear other cookies as needed
      res.clearCookie('other_cookie_name'); // e.g., if there are additional cookies to clear
      res.send('Logged out successfully.'); // Optional: Send a success message
    });
  }

  // Initialize routes
  initializeRoutes() {
    this.router.post('/', this.handleLogout.bind(this));
  }
}

// Export an instance of LogoutRoutes
module.exports = new LogoutRoutes().router;
