// routes/user file

const userController = require('../controllers/user');
const postController = require('../controllers/post');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.addUser);

router.route('/:id/posts')
    .get(postController.getUserPosts)
    .post(postController.addPost);


router.route('/:id/friends')
    .get(userController.getFriendList)
    .post(userController.sendFriendRequest);

router.route('/:id/friends/:fid')
   .patch(userController.acceptFriendRequest)
   .delete(userController.deleteFriend);

router.route('/:id')
    .get(userController.getUserByEmail)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;