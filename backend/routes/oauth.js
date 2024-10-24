// oauth.js
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

// Function to get user data from Google
async function getUserData(access_token) {
  const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
  return response.json();
}

// OAuth route handler
router.get('/', async function (req, res, next) {
  const code = req.query.code; // Get the authorization code from the query

  console.log("Authorization code received: ", code);

  try {
    const redirectUrl = 'http://localhost:4000/oauth';
    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectUrl
    );

    // Exchange the authorization code for tokens
    const tokenResponse = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokenResponse.tokens); // Set the credentials
    console.log('Token received:', tokenResponse.tokens);

    const user = oAuth2Client.credentials; // Get the credentials

    // Fetch user data using the access token
    const userData = await getUserData(user.access_token);
    console.log('User data:', userData);

    // Save user information in session
    req.session.userId = userData.sub;
    req.session.userName = userData.name;
    req.session.picture = userData.picture;

    // Redirect user after successful authentication
    res.redirect('http://localhost:5000/success'); // Assuming you have a success page at this URL

  } catch (err) {
    console.error('Error during token exchange:', err);
    res.redirect('http://localhost:5000/error'); // Redirect to an error page
  }
});

module.exports = router;
