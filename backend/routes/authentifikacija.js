const express = require('express');
const router = express.Router();
const pool = require('../db'); 

function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next();
    }
    return res.status(401).json({ message: 'Unauthorized: You must log in first.' });
}

router.get('/', isAuthenticated, (req, res) => {
    // autentifikacija
    res.json({
        message: 'This is protected data',
        user: {
            userId: req.session.userId,
            imeKorisnika: req.session.ime,
            prezimeKorisnika: req.session.prezime,

            userName: req.session.userName,
            email:req.session.email,
            picture: req.session.picture
        } // Send the user info stored in the session
    });
});

router.post('/additional-signup', async (req, res) => {
    const { firstName, lastName, email, apartmentNumber } = req.body;

    try {
        // Insert data into the database, setting `aktivan` to true upon signup
        const insertQuery = `
            INSERT INTO korisnik (ime, prezime, lozinka,email, stan_id, aktivan)
            VALUES ($1, $2, $3, $4, $5,$6)
            ON CONFLICT (email) DO UPDATE SET
                ime = EXCLUDED.ime,
                prezime = EXCLUDED.prezime,
                lozinka=EXCLUDED.lozinka,
                stan_id = EXCLUDED.stan_id,
                aktivan = EXCLUDED.aktivan
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [firstName, lastName,'test' ,email, apartmentNumber, false]);

        // Update the session with the received data
        req.session.ime = firstName;
        req.session.prezime = lastName;
        req.session.email = email;

        res.json({
            message: 'User data successfully stored in the database.',
            user: result.rows[0]
        });
    } catch (error) {
        console.error("Error inserting data into database:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Export the router
module.exports = router;
