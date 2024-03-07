const postController = require('../controllers/post');

const express = require('express');
var router = express.Router();

router.route('/')

    .get(postController.getPosts)
    .post(postController.addPost);

router.route('/:id')
   .get(postController.getPostById)
   .patch(postController.editPost)
   .delete(postController.deletePost)


module.exports = router;
