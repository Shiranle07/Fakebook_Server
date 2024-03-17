const express = require('express');
var app = express();
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "1000mb"}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());


// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));


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

app.listen(process.env.PORT);