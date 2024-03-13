// author:muhammadhaaris.j

// importing modules
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

// initiating express() to app and set use
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// initiating PORT
const PORT = process.env.PORT || 3000;

// Default page route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// route and logic for register
app.post('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// route and logic for login
app.post('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Handling invalid url error
app.use((req, res, next) => {
    res.status(404).send('<h1 style="color:red;">The page you requested is not available</h1>');
});