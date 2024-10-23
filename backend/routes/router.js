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
    const query = 'INSERT INTO your_table_name (email, website, poruka) VALUES ($1, $2, $3) RETURNING *';
    const values = [email, website, poruka];

    const result = await pool.query(query, values);
    console.log(`${email} : ${poruka} | ${website}`);
    res.send("Hvala Vam i LP");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
