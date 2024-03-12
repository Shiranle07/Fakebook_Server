// controllers/user file

const userService = require("../services/user");

const addUser= async(req, res) => {
    const response = await userService.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.profilePhoto);

    if(response){
        res.json(response)
    }
    else res.status(409).json({ error: "Email already exists" })
};

const getUserById= async(req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }
        res.json(user);
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
        const userEmail = data.userEmail;
        // Call updateUser service method with extracted email and other parameters
        const user = await userService.updateUser(req.params.id, req.body.userBody, userEmail);

        if(userEmail != req.body.user_email) return res.status(404).json({ errors: ['It is not your user!'] });

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
        const userEmail = data.userEmail;
        // Call deleteUser service method with extracted email and other parameters
        const user = await userService.deleteUser(req.params.id, userEmail);
        
        if(userEmail != req.body.user_email) return res.status(404).json({ errors: ['It is not your user!'] });

        if (!user) {
            return res.status(404).json({ errors: ['User not found'] });
        }
        res.json(user);
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ errors: ['Server error'] });
    }
};

const sendFriendRequest = async (req, res) => {
    const senderEmail = req.body.senderEmail;
    const receiverEmail = req.body.receiverEmail;

    const response = await userService.sendFriendRequest(senderEmail, receiverEmail);

    if (response) {
        res.json(response);
    } else {
        res.status(400).json({ error: "Failed to send friend request" });
    }
};

const rejectFriendRequest = async (req, res) => {
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
    const deleterEmail = req.body.deleterEmail;
    const deletedEmail = req.body.deletedEmail;
    
    try {
        const response = await userService.deleteFriend(deleterEmail, deletedEmail);

        if (response) {
            res.json({ message: "Friendship deleted successfully" });
        } else {
            res.status(400).json({ error: "Failed to delete friendship" });
        }
    } catch (error) {
        console.error("Error deleting friendship:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { addUser, sendFriendRequest, acceptFriendRequest, deleteFriend, rejectFriendRequest, getUserById, updateUser, deleteUser };