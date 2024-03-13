// routes/user file

const userController = require('../controllers/user');

const express = require('express');
var router = express.Router();

router.route('/')
    .post(userController.addUser);

router.route('/:id/friends')
// .get -> returns the friends list of the id's user, only for his friends (by the JWT who send the request)
    .post(userController.sendFriendRequest);

// router.route('/friend-rejectRequest')
//     .post(userController.rejectFriendRequest);

router.route('/:id/friends/:fid')
   .patch(userController.acceptFriendRequest)
   .delete(userController.deleteFriend);

router.route('/:id')
    .get(userController.getUserById)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);


module.exports = router;