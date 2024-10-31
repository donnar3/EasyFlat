const express = require('express');
const router = express.Router();
const dotenv=require('dotenv')
const { OAuth2Client }=require('google-auth-library');
const { access } = require('fs');
dotenv.config();
router.post('/',async function(req,res,next){
    res.header('Access-Control-Allow-Origin','http://localhost:5000');
    res.header('Referrer-Policy','no-referr-when-downgrade');

    const redirectUrl='http://localhost:4000/oauth'

    const oAuth2Client=new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectUrl     
    );

    const authorizeUrl=oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope:'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid',
        prompt:'consent'
    });
    res.json({url:authorizeUrl})
});

module.exports=router;