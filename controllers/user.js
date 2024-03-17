// controllers/user file
const jwt = require("jsonwebtoken");
const userService = require("../services/user");

const addUser= async(req, res) => {
    console.log("photo in server", req.body.profilePhoto)
    const response = await userService.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.profilePhoto);

    if(response){
        res.json(response)
    }
    else res.status(409).json({ error: "Email already exists" })
};

const getUserByEmail = async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Extract the email of the requesting user from the token payload
        const requestingUserEmail = data.userEmail;

        // Extract requested user's email from the request parameters
        const requestedUserEmail = req.params.id;

        // Fetch the requested user's details
        const requestedUser = await userService.getUserByEmail(requestedUserEmail);

        if (!requestedUser) {
            return res.status(404).json({ errors: ['User not found'] });
        }

        // Check if requesting user is friends with the requested user
        const areFriends = requestedUser.friends.includes(requestingUserEmail);

        // Check if requesting user has sent a friend request to the requested user
        const friendRequestSent = requestedUser.friend_reqs_received.includes(requestingUserEmail);

        // Check if requesting user has received a friend request from the requested user
        const friendRequestReceived = requestedUser.friend_reqs_sent.includes(requestingUserEmail);

        let status;

        if (requestingUserEmail == requestedUserEmail) {
            status = "user";
        } else if (areFriends){
            status = "Friends";
        } else if (friendRequestSent) {
            status = 'Requested';
        } else if (friendRequestReceived) {
            status = 'Confirm';
        } else {
            status = 'Add friend';
        }
        return res.json({ user: requestedUser, status });
    } catch (error) {
        console.error("Error retrieving user:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const updateUser = async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const requested_user = data.userEmail;
        // Call updateUser service method with extracted email and other parameters
        const user = await userService.updateUser(req.params.id, req.body.userBody, requested_user);

        if(requested_user != req.body.user_email) return res.status(404).json({ errors: ['It is not your user!'] });

        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }
        res.json(user);
    } catch (error) {
        console.error("Error editing user:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const deleteUser = async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const requested_user = data.userEmail;

        if(requested_user != req.params.id) return res.status(404).json({ errors: ['It is not your user!'] });

        const user = await userService.deleteUser(req.params.id, requested_user);

        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }
        res.json(user);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const getFriendList = async (req, res) => {
    try {
        // Extract token from authorization header
        const token = req.headers.authorization.split(" ")[1];
        // Verify the token and extract the data
        const data = jwt.verify(token, "keyyy");
        // Now data contains the decoded token payload, including the email
        const askingUserEmail = data.userEmail;
        console.log("asking:", askingUserEmail)

        // Get the user's ID from the request parameters
        const userId = req.params.id;
        console.log("asked:", userId)

        // Call the service to retrieve the friend list
        const friendList = await userService.getFriendList(askingUserEmail, userId);

        if (!friendList) {
            return res.status(404).json({ error: 'Limited access to friend list' });
        }

        // Return the friend list
        res.json({ friendList });
    } catch (error) {
        console.error('Error fetching friend list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const sendFriendRequest = async (req, res) => {
    // Extract token from authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token and extract the data
    const data = jwt.verify(token, "keyyy");
    // Now data contains the decoded token payload, including the email
    const senderEmail = data.userEmail;
    console.log("user requested:", senderEmail)

    const receiverEmail = req.params.id;

    const response = await userService.sendFriendRequest(senderEmail, receiverEmail);

    if (response) {
        res.json(response);
    } else {
        res.status(400).json({ error: "Failed to send friend request" });
    }
};

const rejectFriendRequest = async (req, res) => {
    // Extract token from authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token and extract the data
    const data = jwt.verify(token, "keyyy");
    // Now data contains the decoded token payload, including the email
    const requested_user = data.requested_user;
    console.log("user requested:", requested_user)

    const receiverEmail = req.body.receiverEmail;
    const senderEmail = req.body.senderEmail;

    const response = await userService.rejectFriendRequest(receiverEmail, senderEmail);

    if (response) {
        res.json(response);
    } else {
        res.status(400).json({ error: "Failed to reject friend request" });
    }

};

const acceptFriendRequest = async (req, res) => {
    // Extract token from authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token and extract the data
    const data = jwt.verify(token, "keyyy");
    // Now data contains the decoded token payload, including the email
    const requested_user = data.requested_user;
    console.log("user requested:", requested_user)

    const receiverEmail = req.body.receiverEmail;
    const senderEmail = req.body.senderEmail;

    const response = await userService.acceptFriendRequest(receiverEmail, senderEmail);

    if (response) {
        res.json(response);
    } else {
        res.status(400).json({ error: "Failed to accept friend request" });
    }
};

const deleteFriend = async(req, res) => {
    // Extract token from authorization header
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token and extract the data
    const data = jwt.verify(token, "keyyy");
    // Now data contains the decoded token payload, including the email
    const requested_user = data.requested_user;
    console.log("user requested:", requested_user)
    
    const deleterEmail = req.body.deleterEmail;
    const deletedEmail = req.body.deletedEmail;
    
    try {
        const response = await userService.deleteFriend(deleterEmail, deletedEmail);

        if (response) {
            res.json({ message: "Deleted successfully" });
        } else {
            res.status(400).json({ error: "Failed to delete friendship" });
        }
    } catch (error) {
        console.error("Error deleting friendship:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addUser, sendFriendRequest, acceptFriendRequest, deleteFriend, rejectFriendRequest, getUserByEmail, updateUser, deleteUser, getFriendList };