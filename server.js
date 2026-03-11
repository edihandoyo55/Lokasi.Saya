const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Setup Session untuk Login
app.use(session({
    secret: 'kunci-rahasia-anda',
    resave: false,
    saveUninitialized: true
}));

// Simulasi Database User
const users = { "user123": { password: "password123", locations: [] } };

// Middleware: Cek apakah user sudah login
const authMiddleware = (req, res, next) => {
    if (req.session.username) next();
    else res.status(401).send("Harap login terlebih dahulu");
};

// Route Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        req.session.username = username;
        res.send({ message: "Login berhasil" });
    } else {
        res.status(401).send("Username atau password salah");
    }
});

// Route Simpan Lokasi (Hanya untuk user yang login)
app.post('/update-location', authMiddleware, (req, res) => {
    const { lat, lng } = req.body;
    const username = req.session.username;
    
    users[username].locations.push({ lat, lng, time: new Date() });
    console.log(`Lokasi ${username}: Lat ${lat}, Lng ${lng}`);
    res.send({ status: "Lokasi diperbarui" });
});

app.listen(3000, () => console.log('Server lari di http://localhost:3000'));
