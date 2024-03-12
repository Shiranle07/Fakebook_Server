// services/user file

const User = require('../models/user');
const bcrypt = require('bcrypt');


const addUser = async(firstName, lastName, email, password, photo) => {
    const check = await User.findOne({email});
    if(!check){
        const user = new User({firstName : firstName, lastName : lastName,
            email : email, password : password});
        if (photo) user.profilePhoto = photo;
        return await user.save();
    }
    else return null;

}

const authenticateUser = async (email, password) => {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        return null; // User not found
    }

    // Compare the provided password with the hashed password stored in the database
    if (password == user.password) {
        return user; 
    }

    return null;
};

const sendFriendRequest = async (senderEmail, receiverEmail) => {
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) {
        return null; // Sender or receiver not found
    }

    if (sender.friends.includes(receiver.email)) {
        return null; // Sender and receiver are already friends
    }

    if (sender.friend_reqs_sent.includes(receiver.email)) {
        return null; // Friend request already sent
    }

    receiver.friend_reqs_received.push(sender.email);
    sender.friend_reqs_sent.push(receiver.email);

    await sender.save();
    await receiver.save();

    return { sender, receiver }; // Return sender and receiver information
};

const acceptFriendRequest = async (receiverEmail, senderEmail) => {
    const receiver = await User.findOne({ email: receiverEmail });
    const sender = await User.findOne({ email: senderEmail });

    if (!receiver || !sender) {
        return null; // Sender or receiver not found
    }

    if (!receiver.friend_reqs_received.includes(sender.email)) {
        return null; // No friend request found from sender
    }

    receiver.friends.push(sender.email);
    sender.friends.push(receiver.email);

    // Remove sender from receiver's friend requests received list
    receiver.friend_reqs_received = receiver.friend_reqs_received.filter(requesterId => requesterId.toString() !== sender.email.toString());

    // Remove receiver from sender's friend requests sent list
    sender.friend_reqs_sent = sender.friend_reqs_sent.filter(receiverId => receiverId.toString() !== receiver.email.toString());

    await sender.save();
    await receiver.save();

    return { sender, receiver }; // Return sender and receiver information
};


const deleteFriend = async (receiverEmail, senderEmail) => {
    const deleter = await User.findOne({ email: deleterEmail });
    const deleted = await User.findOne({ email: deletedEmail });

    if (!deleter || !deleted) {
        return null; // deleter or deleted not found
    }

    if (!deleter.friends.includes(deleted.email) || !deleted.friends.includes(deleter.email)) {
        return null; // Deleter and deleted are not friends
    }

    // Remove deleted from deleter's friends list
    deleter.friends.pull(deletedEmail);

    // Remove deleter from deleted's friends list
    deleted.friends.pull(deleterEmail);

    await deleter.save();
    await deleted.save();

    return { deleter, deleted }; // Return deleter and deleted information

};

module.exports = { addUser, authenticateUser, sendFriendRequest, acceptFriendRequest, deleteFriend };