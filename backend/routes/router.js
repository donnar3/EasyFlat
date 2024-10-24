const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import the pool

// Example route to fetch users from the database
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM korisnik'); // Replace with your table name
    res.json(result.rows);
  } catch (err) {
    console.log("Keksic");
    console.error(err.message);
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
  console.log("Primili smo login podatke");

  const { email, sifra } = req.body;
  try {

    console.log(`${email} : ${sifra}`);
    if (!email) {
      return res.send("Nije upisan email"); // Use return to stop execution here
    }  
    
    const result = await pool.query(
      'SELECT * FROM korisnik WHERE email = $1 AND lozinka = $2',
      [email, sifra]
    );
    if (result.rows.length > 0) {
      // User found
      res.send("Login Uspješan");
    } else {
      // No user found with the given email and password
      res.status(401).send("Pogrešan email ili sifra.");
    }  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
