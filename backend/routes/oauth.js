// oauth.js
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const pool = require('../db'); // Import your database connection

dotenv.config();

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  return response.json();
}

// Check if the email exists in the database and get its activation status
async function getEmailStatusInDatabase(email) {
  const result = await pool.query('SELECT aktivan FROM korisnik WHERE email = $1', [email]);
  // Return the value of aktivan if email exists, otherwise return null
  return result.rows.length > 0 ? result.rows[0].aktivan : null; 
}

// OAuth route handler
router.get('/', async function (req, res, next) {
  const code = req.query.code;

  console.log("Authorization code received: ", code);

  try {
    const redirectUrl = 'http://localhost:4000/oauth';
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens);
    console.log('Token received:', tokenResponse.tokens);

    const userData = await getUserData(tokenResponse.tokens.access_token);
    console.log('User data:', userData);

    // Access the email property here
    req.session.userId = userData.sub;
    req.session.userName = userData.name;
    req.session.ime = userData.given_name;
    req.session.prezime = userData.family_name;
    req.session.picture = userData.picture;
    req.session.email = userData.email;  // Storing email in session

    // Check the email status in the database
    const emailStatus = await getEmailStatusInDatabase(userData.email);

    // Conditional redirection based on email status
    if (emailStatus === true) {
      res.redirect('http://localhost:5000/home'); // Redirect to home if aktivan is true
    } else if (emailStatus === false) {
      // Inform user if aktivan is false and delete session
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
      res.redirect('http://localhost:5000/potvrda'); // Redirect to dodajInfo if email does not exist
    }

  } catch (err) {
    console.error('Error during token exchange:', err);
    res.redirect('http://localhost:5000/error');
  }
});

module.exports = router;
