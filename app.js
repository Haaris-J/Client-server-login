// author1:muhammadhaaris.j
// author2:

// importing modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const data = require('./dataModel');

// initiating express() to app and set use
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// initiating PORT
const PORT = process.env.PORT || 3000;

// Default page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// route and logic for register
app.post('/register', async(req, res) => {
    const { username, secretcode, password, email, answer1, answer2 } = req.body;
    console.log(`${username} ${secretcode} ${password} ${email} ${answer1} ${answer2}`);
    try {
        const hashedsecretcode = await bcrypt.hash(secretcode, 1);
        console.log(`${hashedsecretcode}`);
        const hashedPassword = await bcrypt.hash(password, 1);
        console.log(`${hashedPassword}`);
        await data.create({ username, secretcode: hashedsecretcode, password: hashedPassword, email, answer1, answer2 });
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    } catch (error) {
        console.log(error)
        res.status(500).send(`<h1 style="color:red;">Registration failed!</h1><br><a href="http://localhost:${PORT}/">Return to website</a>`);
    }
});

// route and logic for login
app.post('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handling invalid url error
app.use((req, res, next) => {
    res.status(404).send(`<h1 style="color:red;">The page you requested is not available</h1><br><a href="http://localhost:${PORT}/">Return to website</a>`);
});

// Function to start porject and mongo db
const start = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/client-server-login');

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Function call to start
start();