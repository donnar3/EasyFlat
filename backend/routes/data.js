const express = require('express');
const router = express.Router();
const pool = require('../db'); 

// Ruta za dohvacanje posljednje objavljenih diskusija.       primjer koristenja sa frontenda: file://./../examples/allDiscussionsFetch.js
router.get('/allDiscussions', async function (req, res){
    try {
  
        // Kreiraj i napuni listu s posljednjim diskusijama.
        let discussionList = [];
        let brojZatrazenihDiskusija = req.body.brojZatrazenihDiskusija || 10;   
        const result = await pool.query('SELECT id, naslov, kreator, opis, datum, br_odgovora, id_forme FROM diskusija ORDER BY datum DESC LIMIT $1;', [brojZatrazenihDiskusija]); // id, naslov, kreator, opis, datum, br_odgovora, id_forme
  
        // Za svaki result iz query-a zapisi trazene stupce u listu za ispis.
        for (let i = 0; i < result.rowCount; i++) {
          let nextDiscussion = {};
          nextDiscussion.id = result.rows[i].id;
          nextDiscussion.naslov = result.rows[i].naslov;
          nextDiscussion.kreator = result.rows[i].kreator;
          nextDiscussion.opis = result.rows[i].opis;
          nextDiscussion.datum = result.rows[i].datum;
          nextDiscussion.br_odgovora = result.rows[i].br_odgovora;
          //nextDiscussion.id_forme = result.rows[i].id_forme;
          
          // Ako je pridruzen id_forme dodaj formu u objekt za ispis.
          if (result.rows[i].id_forme !== null) {
            let forma = await pool.query('SELECT id, naslov, glasova_da, glasova_ne, datum_isteklo FROM glasanje_forma WHERE id = $1', [result.rows[i].id_forme])
            nextDiscussion.forma = forma.rows[0];
          }
  
          discussionList.push(nextDiscussion);
        }
  
        // Posalji listu u json formatu.
        res.json(discussionList);
    } catch (err) {
        console.log("erro in /allDiscussions");
        console.log(err.message);
        res.status(500).send('Server Error');
    }
  });

  module.exports = router;