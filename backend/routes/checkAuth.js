const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  console.log("Doslo je tu:");
  console.log(req.session.userId)
    if (req.session.userId) {
      res.json({ isAuthenticated: true });
    } else {
      res.json({ isAuthenticated: false });
    }
  });


  module.exports = router;
