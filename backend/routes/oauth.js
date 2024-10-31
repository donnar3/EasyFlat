// oauth.js
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  return response.json();
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

    // Conditional redirection based on user information
    res.redirect(userData.email ? 'http://localhost:5000/home' : 'http://localhost:5000/dodajInfo'); 

  } catch (err) {
    console.error('Error during token exchange:', err);
    res.redirect('http://localhost:5000/error');
  }
});


module.exports = router;
