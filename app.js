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
app.use('/api/posts', posts);


const users = require('./routes/user');

app.use('/api/users', users);


const token = require('./routes/token');

app.use('/api/tokens', token);

app.listen(process.env.PORT, async () => {
  console.log(`Node.js server running on port ${process.env.PORT}`);
  const bloomService = require('./services/bloom');
  await bloomService.initialize(
    process.env.BLOOM_ADDRESS, 
    process.env.BLOOM_PORT,
    process.env.BLOOM_URLS,
    process.env.BLOOM_FIRST_LINE
  )});


