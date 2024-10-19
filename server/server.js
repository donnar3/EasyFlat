const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Sample route
app.get('/api/message', (req, res) => {
    res.json({ message: 'Potvrda od api!' });
});
app.get('/', (req, res) => {
    res.send('Potvrda servera');
});

app.listen(PORT, () => {
    console.log(`Server je na portu ${PORT}`);
});
