const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.get('/allDiscussions', async function (req, res){
    try {
        res.json("aaa");
        console.log("Some discussions info");
    } catch (error) {
        console.log("error");
    }
});
  