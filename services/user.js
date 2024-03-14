// services/user file

const User = require('../models/user');
const bcrypt = require('bcrypt');


const addUser = async(firstName, lastName, email, password, photo) => {
    const check = await User.findOne({email});
    if(!check){
        const user = new User({firstName : firstName, lastName : lastName,
            email : email, password : password, profilePhoto : photo});
        return await user.save();
    }
    else return null;

}

const updateUser = async(id, userBody) => {
    const user = await getUserByEmail(id);
    if (!user){
        return null;
    }
    user.userBody = userBody;
    await user.save();
    return user;
}

const deleteUser = async(id) => {
    const user = await getUserByEmail(id);
    if (!user){
        return null;
    }
    await user.deleteOne();
    return user;
};

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

const getUserByEmail = async (email) => {
    const user = await User.findOne({ email });
    if(user){
        return user;
    }
    return null;
}

const getFriendList = async (askingUser, askedUser) => {
    try {
        // Check if the asking user is in the asked user's friends list
        const askedUserDetails = await User.findById(askedUser);

        if (!askedUserDetails) {
            return null; // Asked user not found
        }

        // Check if the asking user is in the asked user's friends list
        const isFriend = askedUserDetails.friends.includes(askingUser);

        if (!isFriend || (askingUser != askedUser)) {
            return null; // The asking user is not a friend of the asked user
        }

        // Retrieve the friend list for the asked user
        const friendList = await User.findById(askedUser, 'friends').populate('friends', 'firstName lastName');

        if (!friendList || !friendList.friends) {
            return null; // No friends found for the asked user
        }

        return friendList.friends;
    } catch (error) {
        console.error('Error fetching friend list:', error);
        throw error;
    }
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

const rejectFriendRequest = async (receiverEmail, senderEmail) => {
    const receiver = await User.findOne({ email: receiverEmail });
    const sender = await User.findOne({ email: senderEmail });

    if (!receiver || !sender) {
        return null; // Sender or receiver not found
    }

    // Check if the sender's email is in the receiver's friend requests received list
    if (receiver.friend_reqs_received.includes(sender.email)) {
        // Remove sender from receiver's friend requests received list
        receiver.friend_reqs_received = receiver.friend_reqs_received.filter(requesterId => requesterId.toString() !== sender.email.toString());
        // Remove receiver from sender's friend requests sent list
        sender.friend_reqs_sent = sender.friend_reqs_sent.filter(receiverId => receiverId.toString() !== receiver.email.toString());
    } else if (sender.friend_reqs_sent.includes(receiver.email)) {
        // Check if the receiver's email is in the sender's friend requests sent list
        // Remove receiver from sender's friend requests sent list
        sender.friend_reqs_sent = sender.friend_reqs_sent.filter(receiverId => receiverId.toString() !== receiver.email.toString());
        // Remove sender from receiver's friend requests received list
        receiver.friend_reqs_received = receiver.friend_reqs_received.filter(requesterId => requesterId.toString() !== sender.email.toString());
    } else {
        // If neither sender nor receiver are in each other's friend requests lists, return null
        return null;
    }

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


const deleteFriend = async (deleterEmail, deletedEmail) => {
    const deleter = await User.findOne({ email: deleterEmail });
    const deleted = await User.findOne({ email: deletedEmail });

    if (!deleter || !deleted) {
        return null; // deleter or deleted not found
    }

    if (!deleter.friends.includes(deleted.email) || !deleted.friends.includes(deleter.email)) {
        friendReq = rejectFriendRequest(deleter, deleted);
        if (!friendReq) return null; // deleter and deleted are not friends
        return friendReq;
    }

    // Remove deleted from deleter's friends list
    deleter.friends.pull(deletedEmail);

    // Remove deleter from deleted's friends list
    deleted.friends.pull(deleterEmail);

    await deleter.save();
    await deleted.save();

    return { deleter, deleted }; // Return deleter and deleted information

};

module.exports = { addUser, authenticateUser, sendFriendRequest, acceptFriendRequest, deleteFriend, rejectFriendRequest, getUserByEmail, updateUser, deleteUser, getFriendList };

