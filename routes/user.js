// routes/user file

const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.addUser);

router.route('/friend-request')
    .post(userController.sendFriendRequest);

router.route('/friend-rejectRequest')
    .post(userController.rejectFriendRequest);

router.route('/:id/friends/:fid')
   .patch(userController.acceptFriendRequest)
   .delete(userController.deleteFriend);

// router.route('/friend-request/accept')
//     .post(userController.acceptFriendRequest);


module.exports = router;