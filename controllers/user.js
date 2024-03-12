// controllers/user file

const userService = require("../services/user");

const addUser= async(req, res) => {
    const response = await userService.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.profilePhoto);

    if(response){
        res.json(response)
    }
    else res.status(409).json({ error: "Email already exists" })
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

module.exports = { addUser, sendFriendRequest, acceptFriendRequest, deleteFriend };