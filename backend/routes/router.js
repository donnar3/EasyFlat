const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT stan_id from stan WHERE zauzet = FALSE'); 
    res.json(result.rows);
  } catch (err) {
    console.log("Keksic");
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// Ruta za dohvacanje posljednje objavljenih diskusija.
router.get('/allDiscussions', async function (req, res){
  try {

      // Kreiraj i napuni listu s posljednjim diskusijama.

      let discussionList = [];
      let brojZatrazenihDiskusija = 10;   // Ovo bi trebalo određivat koliko Discussion-a saljemo. tipa      let brojZatrazenihDiskusija = req.brDis
      const result = await pool.query('SELECT id, naslov, kreator, opis, datum, br_odgovora, id_forme FROM diskusija ORDER BY datum DESC LIMIT $1;', [brojZatrazenihDiskusija]); // id, naslov, kreator, opis, datum, br_odgovora, id_forme

      // Za svaki result is query-a zapisi trazene stupce u listu za ispis.
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
          let forma = await pool.query('SELECT * FROM glasanje_forma WHERE id = $1', [result.rows[i].id_forme])
          nextDiscussion.forma = forma.rows[0]; // <------- UREDITI OVAJ OBJEKT!
        }

        discussionList.push(nextDiscussion);
      }


      // Posalji listu u json formatu.
      res.json(discussionList);
  } catch (err) {
      console.log("erro in /allDiscussions");
      res.status(500).send('Server Error');
  }
});


// Example POST route to insert new data
router.post('/contact', async (req, res) => {
  console.log("Received contact data");

  const { email, website, poruka } = req.body;
  try {
    //const query = 'INSERT INTO your_table_name (email, website, poruka) VALUES ($1, $2, $3) RETURNING *';
    //const values = [email, website, poruka];

    //const result = await pool.query(query, values);
    console.log(`${email} : ${poruka} | ${website}`);
    if (!poruka) {
      return res.send("Nije upisana poruka"); // Use return to stop execution here
    }    
    res.send("Hvala Vam i LP");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
  console.log("Primili smo login podatke YIPPIE");

  const { email, sifra } = req.body;
  try {

    console.log(`${email} : ${sifra}`);
    if (!email) {
      return res.send("Nije upisan email");
    }  
    
    const result = await pool.query(
      'SELECT * FROM korisnik WHERE email = $1 AND lozinka = $2',
      [email, sifra]
    );
    if (result.rows.length > 0) {
      res.send("Login Uspješan");
    } else {
      res.status(401).send("Pogrešan email ili sifra.");
    }  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

/*router.post('/addSignupInfo', async(req,res) => {        //dodavanje korisnika u bazu, bez potvrde administratora
  try{              
    const stanovi = req.body.stanovi;       
    const password = req.body.password;
    const query = `INSERT INTO ${process.env.TABLE} (ime, prezime, email, password, stanovi, authorized, role)
                  VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`; 
    const values = [req.session.name,req.session.surname,'primjer@mail.com',req.body.stanovi,FALSE,'suvlasnik'];
    const result = await pool.query(query, values);
    console.log("Korisnik dodan u bazu, ali ne potvrđen od admina");
    res.send("Hvala na prijavi, admninistrator će u nekoliko dana pregledati i potvrditi prijavu :D");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
})
*/



module.exports = router;
