const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch'); // Ensure you have node-fetch installed

// Function to get user data from Google
async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    const data = await response.json();
    console.log('data', data);
}

// OAuth route handler
router.get('/', async function(req, res, next) {
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
        console.log('User credentials:', user);

        // Fetch user data using the access token
        await getUserData(user.access_token);
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>User Data</title>
            </head>
            <body>
                <h1>User data retrieved successfully!</h1>
                <img src="https://i1.sndcdn.com/artworks-cWUvXfLtMtIGc9P0-fDFV2g-t1080x1080.png" alt="Your Image" />
            </body>
            </html>
        `);
    } catch (err) {
        console.error('Error during token exchange:', err); // Improved error logging
        res.status(400).send({ error: 'Invalid request', message: err.message });
    }
});

module.exports = router;
