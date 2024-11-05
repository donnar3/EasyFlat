// routes/OAuthRoutes.js
const express = require('express');
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const pool = require('../db'); // Import your database connection

dotenv.config();

class OAuthRoutes {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  // Method to get user data from Google
  async getUserData(accessToken) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    return response.json();
  }

  // Method to check email activation status in the database
  async getEmailStatusInDatabase(email) {
    const result = await pool.query('SELECT aktivan FROM korisnik WHERE email = $1', [email]);
    return result.rows.length > 0 ? result.rows[0].aktivan : null;
  }
  async getStanBr(email) {
    const result = await pool.query('SELECT stan_id FROM korisnik WHERE email = $1', [email]);
    return result.rows.length > 0 ? result.rows[0].stan_id  : null;
  }
  // OAuth route handler
  async handleOAuth(req, res) {
    const code = req.query.code;
    console.log("Authorization code received: ", code);

    try {
      const redirectUrl = 'http://localhost:4000/oauth';
      const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl
      );

      // Get tokens using the authorization code
      const tokenResponse = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(tokenResponse.tokens);
      console.log('Token received:', tokenResponse.tokens);

      // Retrieve user data
      const userData = await this.getUserData(tokenResponse.tokens.access_token);
      console.log('User data:', userData);

      // Store user data in session
      req.session.userId = userData.sub;
      req.session.userName = userData.name;
      req.session.ime = userData.given_name;
      req.session.prezime = userData.family_name;
      req.session.picture = userData.picture;
      req.session.email = userData.email;
      req.session.stanBr= await this.getStanBr(userData.email);
      console.log("ovo je u oauth"+ req.session.stanBr);
      // Check the activation status of the email
      const emailStatus = await this.getEmailStatusInDatabase(userData.email);

      // Conditional redirection based on email status
      if (emailStatus === true) {
        res.redirect('http://localhost:5000/home'); // Redirect to home if aktivan is true
      } else if (emailStatus === false) {
        // If the user is inactive, destroy the session and display a message
        req.session.destroy((err) => {
          if (err) {
            console.error("Error destroying session:", err);
          }
          res.status(400).send(`
            <html>
              <body>
                <h1>Već ste poslali zahtijev za pristup ovu email adresu.</h1>
                <p>Moći ćete pristupiti sustavu kada vas Administrator mreže odbori.</p>
                <button onclick="window.location.href='http://localhost:5000/home'">Go to Home</button>
              </body>
            </html>
          `);
        });
      } else {
        res.redirect('http://localhost:5000/potvrda');
      }
    } catch (err) {
      console.error('Error during token exchange:', err);
      res.redirect('http://localhost:5000/error');
    }
  }

  initializeRoutes() {
    this.router.get('/', this.handleOAuth.bind(this));
  }
}

module.exports = new OAuthRoutes().router;
