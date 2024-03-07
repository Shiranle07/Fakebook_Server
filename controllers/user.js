const userService = require("../services/user");

const addUser= async(req, res) => {
    const response = await userService.addUser(req.body.firstName, req.body.lastName, req.body.email, req.body.password, req.body.profilePhoto);

    if(response){
        res.json(response)
    }
    else res.status(409).json({ error: "Email already exists" })
};

module.exports = {addUser};