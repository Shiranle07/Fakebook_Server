const postController = require('../controllers/post');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(postController.addPost);

module.exports = router;
