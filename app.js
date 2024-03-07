const express = require('express');
var app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Use a library to perform the cryptographic operations
const jwt = require("jsonwebtoken");
const key = "Fakebook.Fakebook.Fakebook super key";    

const cors = require('cors'); 
app.use(cors());


const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');
console.log(process.env.CONNECTION_STRING)
console.log(process.env.PORT)

const mongoose = require("mongoose");
mongoose.connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

const posts = require('./routes/post');
app.use('/feed', posts);

// Middleware for JWT authentication
const isLoggedIn = (req, res, next) => {
        // If the request has an authorization header
        if (req.headers.authorization) {
            // Extract the token from the header
            const token = req.headers.authorization.split(" ")[1];
            try {
                // Verify the token is valid
                const data = jwt.verify(token, key);
                console.log('The logged in user is: ' + data.username);
                // Token validation was successful. Continue to the next middleware
                return next();
            } catch (err) {
                return res.status(401).send("Invalid Token");
            }
        } else {
            // If no authorization header is present, send a 403 Forbidden response
            return res.status(403).send('Token required');
        }
    };

app.listen(process.env.PORT);