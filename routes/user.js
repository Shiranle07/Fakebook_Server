// routes/user file

const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.addUser);

router.route('/:id/friends')
//returns the friends list of the id's user, only for his friends (by the JWT who send the request)
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