// oauth.js
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');
const pool = require('../db');

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

    const user = oAuth2Client.credentials; 

    const userData = await getUserData(user.access_token);
    console.log('User data:', userData);

    req.session.userId = userData.sub;
    req.session.userName = userData.name;
    req.session.picture = userData.picture;
    req.session.name = userData.given_name;
    req.session.surname = userData.family_name;
    

    //query da provjeri ima li baza vec njegove informacije
    const query = `SELECT * FROM ${process.env.TABLE} WHERE ime = $1 AND prezime = $2`; //ime tablice zapisano u .env za sada
    const values = [userData.given_name,userData.family_name];    //?inace bi se trebao gledati samo mail kao kljuc umjesto ime+prezime
    const result = await pool.query(query, values);
    //ako ima ide na
    if (result.rowCount > 0){
      res.redirect('http://localhost:5000/home');
      console.log("Korisnik prepoznat, šalje se na home\n");
    } 
    //ako nema ide na :
    else{res.redirect('http://localhost:5000/dodajInfo');}    //dodaje se broj stana, password?,... koji se vracaju na
                                                              //npr. localhost:4000/addSignupInfo
  } catch (err) {
    console.error('Error during token exchange:', err);
    res.redirect('http://localhost:5000/error'); 
  }
});

module.exports = router;
