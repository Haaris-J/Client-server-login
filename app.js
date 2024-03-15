// author1:muhammadhaaris.j

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
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// route and logic for register
app.post('/register', async (req, res) => {
    const { username, secretcode, password, email, answer1, answer2 } = req.body;
    let userExist = false;
    try {
        await data.findOne({
            username: `${username}`,
        })
            .then((document) => {
                if (document != null) {
                    userExist = true;
                }
            });
        console.log(userExist);
        if (!userExist) {
            const hashedsecretcode = await bcrypt.hash(secretcode, 1);
            const hashedPassword = await bcrypt.hash(password, 1);
            await data.create({ username, secretcode: hashedsecretcode, password: hashedPassword, email, answer1, answer2 });
            res.sendFile(path.join(__dirname, 'public', 'login.html'));
        } else {
            res.status(427).send(`<h1 style="color:red;">User Name already exist!</h1><br><a href="register.html">Return to Register page</a>`);
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(`<h1 style="color:red;">Registration failed!</h1><br><a href="http://localhost:${PORT}/">Return to website</a>`);
    }
});

// route and logic for login
app.post('/login', async (req, res) => {
    const { username, secretcode, password } = req.body;
    let userExist = false;
    let dbrecord = {};
    try {
        await data.findOne({
            username: `${username}`,
        })
            .then((document) => {
                if (document != null) {
                    userExist = true;
                    dbrecord = document;
                }
            });
        if(userExist){
            console.log('Username valid');
            if(await bcrypt.compare(password, dbrecord.password) && await bcrypt.compare(secretcode, dbrecord.secretcode)){
                console.log(`Login successful for user ${dbrecord.username}!`);
                res.send(`<h1>Hello ${username}!</h1><br><br><br><a href="index.html">log out</a>`);
            } else {
                res.status(427).send(`<h1 style="color:red;">Invalid password/secretcode!</h1><br><a href="login.html">Return to Login page</a>`);
            }
        } else {
            res.status(427).send(`<h1 style="color:red;">Invalid User Name!</h1><br><a href="login.html">Return to Login page</a>`);
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(`<h1 style="color:red;">Registration failed!</h1><br><a href="http://localhost:${PORT}/">Return to website</a>`);
    }

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