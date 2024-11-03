const express = require('express');
const router = express.Router();
const pool = require('../db');

async function isAdmin(req, res, next) {        //provjerava se je li korisnik koji je zatrazio podatke administrator (pomoću stan_id=0 u bazi)
    const result = await pool.query('SELECT * FROM korisnik WHERE email=$1 AND stan_id=0',[req.session.email]);
    if (result.rowCount>0){
        next();
    }
    else res.status(403).send({ message: 'You do not have the permission to perform this action.' });
}

router.get('/inactiveUsers', isAdmin, async (req,res) => {          //ruta na koju se šalje upit za popis svih neaktivnih korisnika
    try{                                                                    //samo admin može pristupiti (provjera sa isAdmin)
        const result = await pool.query('SELECT ime, prezime, email, stan_id FROM korisnik WHERE aktivan=false');
        res.json(result.rows);
        /*for (let i = 0; i<result.rowCount; i++){
            console.log(result.rows[i].ime);
        }*/ //test
    } catch(err){
        console.log('Error reading data from database: ', err);
        res.status(500).send({ message: 'Internal server error.' });
    }
});

router.post('/activateUser', isAdmin, async (req,res) => {      //ruta za aktiviranje korisnika u bazi (prima body.email kao nacin identifikacije)
    try{
        const updateQuery = await pool.query('UPDATE korisnik SET aktivan = TRUE WHERE email=$1 RETURNING *',[req.body.email]);
        console.log(updateQuery.rows[0]);
    } catch(err){
        console.log('Error updating database: ', err);
        res.status(500).send({ message: 'Internal server error.' });
    }
});

module.exports = router;